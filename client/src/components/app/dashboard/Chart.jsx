import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import ChartJS from 'chart.js/auto'

ChartJS.defaults.font.family = 'Gilroy'
ChartJS.defaults.font.weight = '500'
ChartJS.defaults.color = '#6b7280'
ChartJS.defaults.plugins.legend.position = 'top'
ChartJS.defaults.plugins.legend.align = 'start'
ChartJS.defaults.plugins.tooltip.backgroundColor = '#374151'
ChartJS.defaults.plugins.tooltip.bodyFont.weight = '500'
ChartJS.register({
  id: 'customSpacingLegend',
  beforeInit(chart) {
    const originalFit = chart.legend.fit

    chart.legend.fit = function fit() {
      originalFit.bind(chart.legend)()
      this.height += 16
    }
  },
})

const Chart = ({ info }) => {
  const normalChemicals =
    info.totalChemicals -
    info.lowAmountChemicals -
    info.expiringChemicals -
    info.expiredChemicals -
    info.disposedChemicals -
    info.kivChemicals

  const data = {
    labels: [
      'Normal',
      'Low Amount',
      'Expiring Soon',
      'Expired',
      'Disposed',
      'Keep In View',
    ],
    datasets: [
      {
        label: 'No. of Chemicals',
        data: [
          normalChemicals,
          info.lowAmountChemicals,
          info.expiringChemicals,
          info.expiredChemicals,
          info.disposedChemicals,
          info.kivChemicals,
        ],
        backgroundColor: [
          '#dcfce7',
          '#dbeafe',
          '#fef9c3',
          '#fee2e2',
          '#f3e8ff',
          '#e0e7ff',
        ],
        borderColor: [
          '#16a34a',
          '#2563eb',
          '#ca8a04',
          '#dc2626',
          '#9333ea',
          '#4f46e5',
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) =>
            ` ${context.parsed} Chemical${context.parsed > 1 ? 's' : ''} (${
              context.label
            })`,
        },
      },
    },
  }

  return (
    info.totalChemicals !== 0 && (
      <div className='w-1/5 2xl:w-1/4 xl:w-1/3'>
        <p className='mb-2 font-medium text-gray-500'>
          Status{' '}
          <span className='text-xs text-gray-400'>(No. of Chemicals)</span>
        </p>

        <div className='relative rounded-lg border border-gray-200 bg-white p-2 shadow-sm'>
          <Doughnut data={data} options={options} />
          <p className='p-2 pt-4 text-sm font-medium text-gray-500'>
            Total: {info.totalChemicals} Chemical
            {info.totalChemicals > 1 ? 's ' : ' '}
          </p>
        </div>
      </div>
    )
  )
}

export default Chart
