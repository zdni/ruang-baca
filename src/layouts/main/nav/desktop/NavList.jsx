import { useState, useEffect, forwardRef } from 'react'
import { useLocation } from 'react-router-dom'
// @mui
import { Stack, Fade } from '@mui/material'
// hooks
import useActiveLink from '../../../../hooks/useActiveLink'
//
import { NavItem, NavItemDashboard } from './NavItem'
import { StyledSubheader, StyledPopover } from './styles'

// ----------------------------------------------------------------------

export default function NavList({ item, isOffset }) {
  const { pathname } = useLocation()

  const [openPopover, setOpenPopover] = useState(null)

  const { path, children } = item

  const { active, isExternalLink } = useActiveLink(path, false)

  useEffect(() => {
    if (openPopover) {
      handleClosePopover()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget)
  }

  const handleClosePopover = () => {
    setOpenPopover(null)
  }

  const handleClick = (event) => {
    if (children) {
      handleOpenPopover(event)
    }
  }

  return (
    <>
      <NavItem
        item={item}
        isOffset={isOffset}
        active={active}
        open={Boolean(openPopover)}
        isExternalLink={isExternalLink}
        onClick={handleClick}
      />

      {!!children && (
        <StyledPopover
          open={Boolean(openPopover)}
          anchorEl={openPopover}
          onClose={handleClosePopover}
          anchorReference="anchorPosition"
          anchorPosition={{ top: 0, left: 0 }}
          TransitionComponent={TransitionPopover}
        >
          {children.map((list) => (
            <NavSubList
              key={list.subheader}
              subheader={list.subheader}
              items={list.items}
              isDashboard={list.subheader === 'Dashboard'}
              onClose={handleClosePopover}
            />
          ))}
        </StyledPopover>
      )}
    </>
  )
}

// ----------------------------------------------------------------------

function NavSubList({ items, isDashboard, subheader, onClose }) {
  const { pathname } = useLocation()

  const isActive = (path) => pathname === path

  return (
    <Stack spacing={2.5} gridColumn={isDashboard ? 'span 6' : 'span 2'} alignItems="flex-start">
      <StyledSubheader disableSticky>{subheader}</StyledSubheader>

      {items.map((item) =>
        isDashboard ? (
          <NavItemDashboard key={item.title} item={item} onClick={onClose} />
        ) : (
          <NavItem
            subItem
            key={item.title}
            item={item}
            active={isActive(item.path)}
            onClick={onClose}
          />
        )
      )}
    </Stack>
  )
}

// ----------------------------------------------------------------------

const TransitionPopover = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})
