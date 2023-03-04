import { Box, Button, Typography, Skeleton } from '@mui/material';
import './ErrorDishCard.scss';

interface ErrorDishCardProps {
  img?: string;
  title?: string;
  caption?: string;
  callback?: () => void;
  loading?: boolean;
}

const ErrorDishCard = ({ img, title, caption, callback, loading }: ErrorDishCardProps) => {
  return (
    <Box className="error-dish-card-container">
      {loading ? (
        <>
          <Box className="image-container">
            <Skeleton variant="rectangular" className="loading-image" />
          </Box>
          <Skeleton variant="rectangular" className="loading-element" />
          <Skeleton variant="rectangular" className="loading-button" />
        </>
      ) : (
        <>
          <Box className="image-container">
            <img src={img} alt={title} className="error-image" />
          </Box>
          <Typography variant="h6" className="error-title">
            {title}
          </Typography>
          <Button onClick={callback} variant="secondaryContained" className="error-button">
            {caption}
          </Button>
        </>
      )}
    </Box>
  );
};

export default ErrorDishCard;
