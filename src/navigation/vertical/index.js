const navItems=[
  {
    title: 'Dashboard',
    to: { name: 'index' },
    icon: { icon: 'tabler-chart-treemap' },
  },
  {
    title: 'Company',
    to: { name: 'company' },
    icon: { icon: 'tabler-building-skyscraper' },
  },
  {
    title: 'Employee',
    to: { name: 'employee' },
    icon: { icon: 'tabler-users-group' },
  },
  {
    title: 'Jobs',
    to: { name: 'jobs' },
    icon: { icon: 'tabler-briefcase' },
  },
]

export default function getFilteredNavItems(userType) {
  if (userType === 'SA') {
    return navItems
  } else if (userType === 'CA') {
    return navItems.filter(item => item.title !== 'Company')
  } else {
    return []
  }
}
