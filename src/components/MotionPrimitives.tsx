import React from 'react';
import { motion, type Variants } from 'motion/react';

const LUXURY_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

/**
 * Mount-time fade-up reveal for above-the-fold hero sections so primary content
 * is immediately visible without waiting for scroll events.
 */
export const HeroReveal: React.FC<RevealProps> = ({
  children,
  className = '',
  delay = 0,
  yOffset = 16,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, delay, ease: LUXURY_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Scroll-triggered fade-up reveal for sections across all pages.
 * Uses amount: 'some' with a bottom margin offset so tall mobile sections
 * trigger reliably as soon as they enter the viewport.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  delay = 0,
  yOffset = 22,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some', margin: '0px 0px -36px 0px' }}
      transition={{ duration: 0.5, delay, ease: LUXURY_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const FadeUp = Reveal;

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.46,
      ease: LUXURY_EASE,
    },
  },
};

interface RevealStaggerProps {
  children: React.ReactNode;
  className?: string;
}

export const RevealStagger: React.FC<RevealStaggerProps> = ({
  children,
  className = '',
}) => {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 'some', margin: '0px 0px -24px 0px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface RevealItemProps {
  children: React.ReactNode;
  className?: string;
}

export const RevealItem: React.FC<RevealItemProps> = ({
  children,
  className = '',
}) => {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
};
