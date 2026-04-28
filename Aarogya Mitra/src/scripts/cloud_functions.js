/**
 * Google Cloud Functions - Aarogya Mitra HMS
 * Optimized for Scale & Automated Bed Management
 */

const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const admin = require("firebase-admin");

admin.initializeApp();
const db = getFirestore();

/**
 * TRIGGER: onBedRequestCreated
 * Purpose: Automatically allot beds for critical patients if available.
 */
exports.onBedRequestCreated = onDocumentCreated("bed_requests/{requestId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const requestData = snapshot.data();
    const requestId = event.params.requestId;

    console.log(`[Cloud Function] Processing Bed Request: ${requestId}`);

    // 1. Check Bed Availability
    const bedStatsRef = db.collection("system_stats").doc("beds");
    const bedStatsDoc = await bedStatsRef.get();
    const stats = bedStatsDoc.data();

    const bedType = requestData.is_icu ? "icuAvailable" : "available";
    
    if (stats[bedType] > 0) {
        console.log(`[Cloud Function] Auto-assigning bed for ${requestData.patient_name}`);

        // 2. Atomically decrement bed count
        await bedStatsRef.update({
            [bedType]: FieldValue.increment(-1),
            lastUpdated: FieldValue.serverTimestamp()
        });

        // 3. Update Request Status to 'Auto-Approved'
        await snapshot.ref.update({
            status: "Approved",
            allotment_type: "Cloud-Auto",
            allotted_at: FieldValue.serverTimestamp()
        });

        // 4. Trigger Broadcast Alert
        await db.collection("notifications").add({
            title: "AUTO-ALLOTMENT COMPLETE",
            message: `Cloud engine successfully assigned a bed to ${requestData.patient_name}.`,
            role: "Admin",
            type: "success",
            category: "AR",
            timestamp: FieldValue.serverTimestamp()
        });
    } else {
        // Critical Alert if capacity is full
        await db.collection("notifications").add({
            title: "CRITICAL: CAPACITY REACHED",
            message: `Bed request for ${requestData.patient_name} pending. Manual intervention required.`,
            role: "Admin",
            type: "urgent",
            category: "HS",
            timestamp: FieldValue.serverTimestamp()
        });
    }
});
