'use client'
import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'
import { dateFormat } from '@/utils/dateFormat'
import { formatCurrency } from '@/utils/formatCurrency'
import { StorageKey, StorageUtils } from '@/utils/storage'
import { formatTime } from '@/utils/timeFormat'

import { handleSubmit, type ReportItem, type State } from './actions'

export default function Home() {
  const initialState: State = {
    message: '',
    status: undefined,
    data: undefined,
    errors: {},
  }
  const [state, formAction] = useFormState(handleSubmit, initialState)
  const [reportItems, setReportItems] = useState<ReportItem[]>([])

  useEffect(() => {
    const savedItems: ReportItem[] =
      StorageUtils.get<ReportItem[]>(StorageKey.REPORT_ITEMS) || []
    setReportItems(savedItems)
  }, [])

  useEffect(() => {
    if (state.status === 'success') {
      toast({ description: 'Cập nhật thành công' })

      const newData = [...reportItems, state.data as ReportItem]
      StorageUtils.set(StorageKey.REPORT_ITEMS, newData)
      setReportItems(newData)
    } else if (state.status === 'error') {
      toast({
        description: state.message ?? 'Có lỗi xảy ra, vui lòng thử lại!',
        variant: 'destructive',
      })
    }
  }, [state])

  return (
    <div className="container mt-10">
      <form action={formAction} className="mx-auto max-w-2xl">
        <div className="flex justify-between">
          <h1 className="text-4xl font-semibold">Nhập giao dịch</h1>
          <Button type="submit" className="bg-blue-600">
            Cập nhật
          </Button>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          <div>
            <Label htmlFor="time">Thời gian</Label>
            <Input type="datetime-local" id="time" name="time" />
            {state?.errors?.['time']?.[0] && (
              <p className="mt-1 text-sm text-red-500">
                {state?.errors?.['time']?.[0]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="quantity">Số lượng</Label>
            <Input type="text" id="quantity" name="quantity" />
            {state?.errors?.['quantity']?.[0] && (
              <p className="mt-1 text-sm text-red-500">
                {state?.errors?.['quantity']?.[0]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="unitPrice">Đơn giá</Label>
            <Input type="text" id="unitPrice" name="unitPrice" />
            {state?.errors?.['unitPrice']?.[0] && (
              <p className="mt-1 text-sm text-red-500">
                {state?.errors?.['unitPrice']?.[0]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="totalAmount">Doanh thu</Label>
            <Input type="text" id="totalAmount" name="totalAmount" />
            {state?.errors?.['totalAmount']?.[0] && (
              <p className="mt-1 text-sm text-red-500">
                {state?.errors?.['totalAmount']?.[0]}
              </p>
            )}
          </div>

          <div className="">
            <Select name="gasPumpNumber">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Trụ bơm" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Trụ bơm</SelectLabel>
                  {Array.from({ length: 10 }).map((_, index) => (
                    <SelectItem key={index} value={`${index + 1}`}>
                      {index + 1}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {state?.errors?.['gasPumpNumber']?.[0] && (
              <p className="mt-1 text-sm text-red-500">
                {state?.errors?.['gasPumpNumber']?.[0]}
              </p>
            )}
          </div>
        </div>
      </form>

      <div className="mx-auto mt-10 max-w-2xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">STT</TableHead>
              <TableHead>Ngày</TableHead>
              <TableHead>Giờ</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Đơn giá</TableHead>
              <TableHead>Thành tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportItems.length > 0 ?
              reportItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{dateFormat(new Date(item.time))}</TableCell>
                  <TableCell>{formatTime(new Date(item.time))}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unitPrice}</TableCell>
                  <TableCell>{formatCurrency(item.totalAmount)}</TableCell>
                </TableRow>
              ))
            : <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
