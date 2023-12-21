import { m } from 'framer-motion'
import { forwardRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'
// @mui
import { Link, CardActionArea } from '@mui/material'
// components
import Iconify from '../../../../components/iconify'
import Image from '../../../../components/image'
//
import { ListItem } from './styles'

// ----------------------------------------------------------------------

export const NavItem = forwardRef(
  ({ item, open, isOffset, active, subItem, isExternalLink, ...other }, ref) => {
    const { title, path, children } = item

    const renderContent = (
      <ListItem
        ref={ref}
        disableRipple
        isOffset={isOffset}
        subItem={subItem}
        active={active}
        open={open}
        {...other}
      >
        {title}

        {!!children && (
          <Iconify
            width={16}
            icon={open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
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
)

// ----------------------------------------------------------------------

export function NavItemDashboard({ item, sx, ...other }) {
  return (
    <Link to={item.path} component={RouterLink} {...other}>
      <CardActionArea
        sx={{
          py: 5,
          px: 10,
          borderRadius: 1,
          color: 'text.disabled',
          bgcolor: 'background.neutral',
          ...sx,
        }}
      >
        <m.div
          whileTap="tap"
          whileHover="hover"
          variants={{
            hover: { scale: 1.02 },
            tap: { scale: 0.98 },
          }}
        >
          <Image
            alt="illustration_dashboard"
            src="/assets/illustrations/illustration_dashboard.png"
          />
        </m.div>
      </CardActionArea>
    </Link>
  )
}
