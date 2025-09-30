export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'green';
    case 'scheduled':
      return 'blue';
    case 'completed':
      return 'gray';
    default:
      return 'gray';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'red';
    case 'medium':
      return 'yellow';
    case 'low':
      return 'blue';
    default:
      return 'gray';
  }
};
