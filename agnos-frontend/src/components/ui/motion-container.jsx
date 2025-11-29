import { motion } from "framer-motion";

export const MotionContainer = ({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  initialY = 100,
  initialOpacity = 0,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: initialOpacity, y: initialY }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, ease: "easeOut", delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MotionCard = ({
  children,
  className = "",
  delay = 0.2,
  duration = 0.8,
  initialY = 50,
  initialOpacity = 0,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: initialOpacity, y: initialY }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, ease: "easeOut", delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MotionElement = ({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  initialY = 20,
  initialOpacity = 0,
  as = "div",
  ...props
}) => {
  const MotionComponent = motion[as];

  return (
    <MotionComponent
      initial={{ opacity: initialOpacity, y: initialY }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, ease: "easeOut", delay }}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

export const MotionForm = ({
  children,
  className = "",
  delay = 0.6,
  duration = 0.6,
  initialY = 30,
  initialOpacity = 0,
  ...props
}) => {
  return (
    <motion.form
      initial={{ opacity: initialOpacity, y: initialY }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, ease: "easeOut", delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.form>
  );
};

const MotionComponents = {
  MotionContainer,
  MotionCard,
  MotionElement,
  MotionForm,
};

export default MotionComponents;
