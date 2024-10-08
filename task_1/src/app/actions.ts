import * as XLSX from 'xlsx'
import { z } from 'zod'

interface State {
  data: any[]
  status?: 'success' | 'error'
  error: string
}

export interface ReportItem {
  id: number
  date: string
  time: string
  location: string
  gasPumpNumber: number
  product: string
  quantity: number
  unitPrice: number
  totalAmount: number
  paymentMethod: string
  customerId: string
  customerName?: string
  customerType?: string
  datePaid?: string
  staffId: string
  statusBill: string
}

const fileSchema = z.object({
  name: z.string().refine((name) => name.endsWith('.xlsx'), {
    message: 'Invalid file type. Please upload a .xlsx file.',
  }),
  type: z
    .string()
    .refine(
      (type) =>
        type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      { message: 'Invalid file type. Please upload a .xlsx file.' },
    ),
})

export const handleSubmit = async (prevState: any, formData: FormData) => {
  const file = formData.get('reportFile') as File

  const state: State = {
    data: [],
    error: '',
  }

  if (!file) {
    state.status = 'error'
    state.error = 'No file uploaded'
    return state
  }

  const fileValidation = fileSchema.safeParse(file)
  if (!fileValidation.success) {
    state.status = 'error'
    state.error = fileValidation.error.errors[0].message
    return state
  }

  const arrayBuffer = await file.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]

  const jsonData = XLSX.utils.sheet_to_json(sheet, {
    defval: null,
    range: 7,
    header: 1,
    blankrows: false,
  })

  const [_, ...data] = jsonData

  state.data = (data as (string | number)[][]).map<ReportItem>(
    (item: (string | number)[]) => {
      return {
        id: item[0] as number,
        date: item[1] as string,
        time: item[2] as string,
        location: item[3] as string,
        gasPumpNumber: item[4] as number,
        product: item[5] as string,
        quantity: item[6] as number,
        unitPrice: item[7] as number,
        totalAmount: item[8] as number,
        paymentMethod: item[9] as string,
        customerId: item[10] as string,
        customerName: item[11] as string,
        customerType: item[12] as string,
        datePaid: item[13] as string,
        staffId: item[14] as string,
        statusBill: item[15] as string,
      }
    },
  )
  state.status = 'success'

  return state
}
