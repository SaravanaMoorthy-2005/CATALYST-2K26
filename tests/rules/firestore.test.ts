import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

describe('Firestore Security Rules Static Audit', () => {
  const rulesPath = path.resolve(__dirname, '../../firestore.rules')
  const rulesContent = fs.readFileSync(rulesPath, 'utf8')

  it('enforces default deny for unspecified documents', () => {
    expect(rulesContent).toContain('allow read, write: if false;')
  })

  it('protects invitations as backend-only (read/write false)', () => {
    expect(rulesContent).toMatch(/match\s+\/invitations\/\{invitationId\}\s*\{\s*allow read, write:\s*if false;\s*\}/)
  })

  it('protects notificationJobs as backend-only (read/write false)', () => {
    expect(rulesContent).toMatch(/match\s+\/notificationJobs\/\{jobId\}\s*\{\s*allow read, write:\s*if false;\s*\}/)
  })

  it('restricts medications mutations to Cloud Functions backend only', () => {
    expect(rulesContent).toMatch(/match\s+\/medications\/\{medId\}\s*\{[\s\S]*?allow write:\s*if false;/)
  })

  it('restricts dose occurrences mutations to SafeDose Shield backend transactions', () => {
    expect(rulesContent).toMatch(/match\s+\/doseOccurrences\/\{occId\}\s*\{[\s\S]*?allow write:\s*if false;/)
  })

  it('restricts user profile write to authenticated owner', () => {
    expect(rulesContent).toContain('isUser(uid)')
  })
})
