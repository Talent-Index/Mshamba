function StatusBadge({ status, type = 'default' }) {
  const getStatusStyles = () => {
    switch (type) {
      case 'farm':
        switch (status) {
          case 'seeking_funding':
            return 'bg-yellow-100 text-yellow-800'
          case 'funded':
            return 'bg-green-100 text-green-800'
          case 'active':
            return 'bg-blue-100 text-blue-800'
          case 'completed':
            return 'bg-gray-100 text-gray-800'
          default:
            return 'bg-gray-100 text-gray-800'
        }
      case 'investment':
        switch (status) {
          case 'pending':
            return 'bg-yellow-100 text-yellow-800'
          case 'approved':
            return 'bg-green-100 text-green-800'
          case 'rejected':
            return 'bg-red-100 text-red-800'
          default:
            return 'bg-gray-100 text-gray-800'
        }
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatStatus = (status) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {formatStatus(status)}
    </span>
  )
}

export default StatusBadge
