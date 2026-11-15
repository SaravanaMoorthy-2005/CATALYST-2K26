import * as admin from 'firebase-admin'

// Initialize Admin SDK once
if (admin.apps.length === 0) {
  admin.initializeApp()
}

export const db = admin.firestore()
export const auth = admin.auth()

// 1. Identity & Care Circle Callables
export {
  createCareCircle,
  updateCareProfile,
  createInvitation,
  redeemInvitation,
  revokeInvitation,
  setMemberPermissions,
  revokeMember,
} from './callables/auth'

// 2. Medication & SafeDose Shield Callables
export {
  createMedication,
  updateMedication,
  pauseMedication,
  archiveMedication,
  confirmDose,
  correctDose,
  reportDoseUnconfirmedReason,
} from './callables/medications'

// 3. Appointments Callables
export {
  createAppointment,
  updateAppointment,
  rescheduleAppointment,
  cancelAppointment,
  completeAppointment,
} from './callables/appointments'

// 4. Alerts & Assistance Callables
export {
  createAssistanceRequest,
  acknowledgeAssistance,
  resolveAssistance,
  acknowledgeAlert,
  resolveAlert,
} from './callables/alerts'

// 5. Refill Guardian Callables
export {
  recordOpeningInventory,
  recordRestock,
  adjustInventory,
  createRefillTask,
  assignRefillTask,
  completeRefillTask,
} from './callables/refills'

// 6. DischargeSync Callables
export {
  createReconciliationProposal,
  getReconciliationDiff,
  approveReconciliation,
  rejectReconciliation,
} from './callables/reconciliation'

// 7. CareShift Callables
export {
  createCareTask,
  assignCareTask,
  acceptCareTask,
  declineCareTask,
  completeCareTask,
  generateCareHandoff,
} from './callables/careShift'

// 8. Secondary Features Callables
export {
  recordWellbeingCheckIn,
  exportCarePassport,
  saveAppointmentCompanion,
} from './callables/secondary'

// 9. Scheduled Jobs Engine
export { processNotificationQueue } from './scheduling/notificationEngine'
