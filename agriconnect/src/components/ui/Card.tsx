import { HTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

const paddings = { sm: 'p-4', md: 'p-6', lg: 'p-8' }

export const Card = ({ hover, padding = 'md', className, children, ...props }: CardProps) => (
  <motion.div
    whileHover={hover ? { y: -4, boxShadow: '0 8px 40px rgba(22,101,52,0.16)' } : undefined}
    transition={{ duration: 0.2 }}
    className={cn('card', paddings[padding], className)}
    {...(props as React.ComponentPropsWithoutRef<typeof motion.div>)}
  >
    {children}
  </motion.div>
)
