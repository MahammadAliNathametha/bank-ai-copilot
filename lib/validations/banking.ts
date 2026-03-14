import { z } from "zod";

export const tenantSchema = z.object({
  tenantId: z.string().uuid()
});

export const authActionSchema = z.object({
  action: z.enum(["login", "signup"]),
  email: z.string().email(),
  fullName: z.string().min(2).optional()
});

export const userCreateSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  role: z.enum(["member", "admin"]).optional()
});

export const userUpdateSchema = userCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required"
});

export const accountCreateSchema = z.object({
  userId: z.string().min(1).optional(),
  name: z.string().min(2),
  type: z.string().min(2),
  balance: z.number().nonnegative().default(0)
});

export const accountUpdateSchema = accountCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required"
});

export const transferSchema = z.object({
  fromId: z.number().int().positive(),
  toId: z.number().int().positive(),
  amount: z.number().positive(),
  method: z.enum(["internal", "external", "ach", "fednow", "rtp"])
});

export const transactionFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

export const transactionCreateSchema = z.object({
  accountId: z.number().int().positive(),
  amount: z.number(),
  description: z.string().min(2),
  category: z.string().min(2),
  status: z.enum(["posted", "pending"]).default("posted")
});

export const transactionUpdateSchema = transactionCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required"
});

export const transferUpdateSchema = z.object({
  status: z.enum(["queued", "completed", "cancelled"])
});

export const paymentCreateSchema = z.object({
  recipient: z.string().min(2),
  amount: z.number().positive(),
  channel: z.enum(["p2p", "wire"])
});

export const paymentUpdateSchema = z.object({
  status: z.enum(["processing", "completed", "cancelled"])
});

export const billCreateSchema = z.object({
  payeeId: z.number().int().positive(),
  payeeName: z.string().min(2),
  amount: z.number().positive(),
  schedule: z.string().min(2),
  status: z.enum(["scheduled", "paid", "paused"]).default("scheduled")
});

export const billUpdateSchema = billCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required"
});

export const cardCreateSchema = z.object({
  userId: z.string().min(1),
  last4: z.string().length(4),
  status: z.enum(["active", "locked", "inactive"]).default("inactive"),
  alertsEnabled: z.boolean().default(true)
});

export const cardUpdateSchema = cardCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required"
});

export const loanCreateSchema = z.object({
  userId: z.string().min(1),
  type: z.string().min(2),
  balance: z.number().nonnegative(),
  nextPayment: z.number().nonnegative()
});

export const loanPaymentSchema = z.object({
  id: z.number().int().positive(),
  amount: z.number().positive()
});

export const loanUpdateSchema = loanCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required"
});

export const documentCreateSchema = z.object({
  userId: z.string().min(1),
  url: z.string().min(1),
  type: z.string().min(2),
  status: z.enum(["ready", "processing"]).default("processing")
});

export const documentUpdateSchema = documentCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required"
});

export const notificationCreateSchema = z.object({
  userId: z.string().min(1),
  message: z.string().min(2),
  channel: z.enum(["email", "sms", "push"]),
  status: z.enum(["active", "disabled"]).default("active")
});

export const notificationUpdateSchema = notificationCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required"
});

export const insightCreateSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(2),
  score: z.number().min(0).max(100),
  summary: z.string().min(2)
});

export const insightUpdateSchema = insightCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required"
});

export const complianceCreateSchema = z.object({
  userId: z.string().min(1),
  reg: z.string().min(2),
  status: z.enum(["clear", "review", "blocked"]),
  note: z.string().min(2)
});

export const complianceUpdateSchema = complianceCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required"
});

export const adminMetricCreateSchema = z.object({
  category: z.string().min(2),
  label: z.string().min(2),
  value: z.number()
});

export const adminMetricUpdateSchema = adminMetricCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required"
});

export const supportTicketCreateSchema = z.object({
  userId: z.string().min(1),
  subject: z.string().min(2),
  message: z.string().min(2),
  status: z.enum(["open", "pending", "closed"]).default("open")
});

export const supportTicketUpdateSchema = supportTicketCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required"
});

export const locationCreateSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(2),
  lat: z.number(),
  lng: z.number(),
  kind: z.enum(["atm", "branch"])
});

export const locationUpdateSchema = locationCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required"
});

export const webhookCreateSchema = z.object({
  eventType: z.string().min(2),
  payload: z.record(z.string(), z.unknown()),
  status: z.enum(["received", "processed"]).default("received")
});

export const webhookUpdateSchema = webhookCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required"
});

export const openConnectionCreateSchema = z.object({
  provider: z.string().min(2),
  status: z.enum(["connected", "syncing", "disconnected"]).default("connected"),
  lastSyncedAt: z.string().min(2)
});

export const openConnectionUpdateSchema = openConnectionCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required"
});

export type TransferInput = z.infer<typeof transferSchema>;
