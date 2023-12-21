import { Link as RouterLink } from 'react-router-dom'
// @mui
import { Link, ListItemText, ListItemIcon } from '@mui/material'
// components
import Iconify from '../../../../components/iconify'
//
import { ListItem } from './styles'

// ----------------------------------------------------------------------

export default function NavItem({
  item,
  open,
  active,
  isExternalLink,
  ...other
}) {
  const { title, path, icon, children } = item

  const renderContent = (
    <ListItem active={active} {...other}>
      <ListItemIcon> {icon} </ListItemIcon>

      <ListItemText disableTypography primary={title} />

      {!!children && (
        <Iconify
          width={16}
          icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
          sx={{ ml: 1 }}
        />
      )}
    </ListItem>
  )

  // ExternalLink
  if (isExternalLink) {
    return (
      <Link href={path} target="_blank" rel="noopener" underline="none">
        {renderContent}
      </Link>
    )
  }

  // Has child
  if (children) {
    return renderContent
  }

  // Default
  return (
    <Link to={path} component={RouterLink} underline="none">
      {renderContent}
    </Link>
  )
}
