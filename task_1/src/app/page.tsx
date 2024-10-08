'use client'
import { useFormState } from 'react-dom'

import SubmitButton from '@/components/SubmitButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { handleSubmit, ReportItem } from './actions'
import { TimePicker } from '@/components/TimePicker'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { TimeValue } from 'react-aria'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/utils/formatCurrency'

export default function Home() {
  const [timeStart, setTimeStart] = useState<TimeValue>()
  const [timeEnd, setTimeEnd] = useState<TimeValue>()
  const [totalAmount, setTotalAmount] = useState<number>(0)

  const { toast } = useToast()
  const [state, formAction] = useFormState(handleSubmit, {
    data: [],
    error: '',
  })

  const handleCalculate = () => {
    if (!timeStart || !timeEnd) {
      return toast({
        variant: 'destructive',
        description: 'Please check your time range!',
      })
    }

    const start = new Date()
    start.setHours(timeStart.hour, timeStart.minute, timeStart.second)

    const end = new Date()
    end.setHours(timeEnd.hour, timeEnd.minute, timeEnd.second)

    console.log({ start, end })

    if (start >= end) {
      return toast({
        variant: 'destructive',
        description: 'Start time cannot be greater than or equal to end time!',
      })
    }

    const totalAmount = state.data.reduce((acc, item: ReportItem) => {
      const [checkHour, checkMinute, checkSecond] = item.time
        .split(':')
        .map(Number)
      const check = new Date()
      check.setHours(checkHour, checkMinute, checkSecond, 0)

      if (check >= start && check <= end) {
        return acc + item.totalAmount
      }
      return acc
    }, 0)

    setTotalAmount(totalAmount)
  }

  return (
    <div className="container">
      <div className="flex min-h-screen flex-col items-center justify-center gap-10">
        {state.data.length == 0 ?
          <form
            action={formAction}
            className="grid w-full max-w-sm items-center gap-1.5"
          >
            <Label htmlFor="reportFile">Please upload your file!</Label>
            <Input id="reportFile" name="reportFile" type="file" />
            {state.status === 'error' && (
              <p className="mb-2 text-sm font-normal text-red-500">
                {state.error}
              </p>
            )}
            {state.status === 'success' && (
              <p className="mb-2 text-sm font-normal text-green-500">
                File uploaded successfully!
              </p>
            )}
            <SubmitButton />
          </form>
        : <div className="min-w-96">
            <div className="flex items-end gap-2">
              <p className="font-medium">Total Amount</p>
              <p className="text-2xl font-medium">
                {formatCurrency(totalAmount)}
              </p>
            </div>
            <div className="mt-2 flex gap-2">
              <TimePicker
                hourCycle={24}
                aria-label="Time Start"
                onChange={setTimeStart}
                value={timeStart}
              />
              <TimePicker
                hourCycle={24}
                aria-label="Time End"
                onChange={setTimeEnd}
                value={timeEnd}
              />
            </div>
            <Button
              type="button"
              className="mt-2 w-full font-medium"
              onClick={handleCalculate}
            >
              Calculate
            </Button>
          </div>
        }
      </div>
    </div>
  )
}
