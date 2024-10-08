import { z } from 'zod'

export interface ReportItem {
  time: Date
  gasPumpNumber: number
  quantity: number
  unitPrice: number
  totalAmount: number
}

export interface State {
  data?: ReportItem
  status?: 'success' | 'error'
  message?: string
  errors?: {
    [key: string]: string[]
  }
}

const reportItemSchema = z.object({
  time: z.string().min(1, 'Thời gian không được để trống'),
  gasPumpNumber: z
    .string({
      message: 'Số máy không đúng định dạng!',
    })
    .min(1, 'Không được để trống số máy!'),
  quantity: z
    .number({
      message: 'Số lượng không đúng định dạng!',
    })
    .min(0.1, 'Không được để trống số lượng!'),
  unitPrice: z
    .number({
      message: 'Đơn giá không đúng định dạng!',
    })
    .min(1, 'Không được để trống đơn giá!'),
  totalAmount: z
    .number({
      message: 'Doanh thu không đúng định dạng!',
    })
    .min(1, 'Không được để trống doanh thu!'),
})

export const handleSubmit = (prevState: State, formData: FormData) => {
  const validateFields = reportItemSchema.safeParse({
    time: formData.get('time'),
    gasPumpNumber: formData.get('gasPumpNumber'),
    quantity: Number(formData.get('quantity')),
    unitPrice: Number(formData.get('unitPrice')),
    totalAmount: Number(formData.get('totalAmount')),
  })

  if (!validateFields.success) {
    const state: State = {
      data: undefined,
      status: 'error',
      errors: validateFields.error.flatten().fieldErrors,
      message: 'Oops! Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin',
    }

    return state
  }

  const state: State = {
    data: {
      time: new Date(validateFields.data.time),
      gasPumpNumber: Number(validateFields.data.gasPumpNumber),
      quantity: Number(validateFields.data.quantity),
      unitPrice: Number(validateFields.data.unitPrice),
      totalAmount: Number(validateFields.data.totalAmount),
    },
    status: 'success',
    errors: {},
    message: 'Giao dịch đã được cập nhật',
  }

  return state
}
