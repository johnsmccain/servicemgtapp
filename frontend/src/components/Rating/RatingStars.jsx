import { useState } from 'react';
import { Rating, Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

/**
 * RatingStars Component
 * @param {Object} props - Component props
 * @param {number} props.initialValue - Initial rating value (0-5)
 * @param {boolean} props.readOnly - Whether the rating is read-only
 * @param {Function} props.onChange - Callback when rating changes
 * @param {boolean} props.showLabel - Whether to show the text label
 * @param {string} props.size - Size of stars ('small', 'medium', 'large')
 */
export default function RatingStars({
  initialValue = 0,
  readOnly = false,
  onChange = () => {},
  showLabel = true,
  size = 'medium'
}) {
  const [value, setValue] = useState(initialValue);
  const [hover, setHover] = useState(-1);

  // Convert contract rating (with 1 decimal precision) to appropriate format
  // e.g., 45 (meaning 4.5) becomes 4.5
  const normalizedInitialValue = typeof initialValue === 'number' && initialValue > 5
    ? initialValue / 10
    : initialValue;

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // Pass the rating in the format expected by the contract (e.g., 4.5 as 45)
    onChange(newValue !== null ? Math.round(newValue * 10) / 10 : 0);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: showLabel ? 'column' : 'row',
      }}
    >
      <Rating
        name="rating-stars"
        value={normalizedInitialValue}
        precision={0.5}
        onChange={handleChange}
        onChangeActive={(event, newHover) => setHover(newHover)}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        readOnly={readOnly}
        size={size}
      />
      {showLabel && (
        <Typography sx={{ ml: 1 }}>
          {labels[hover !== -1 ? hover : normalizedInitialValue]}
        </Typography>
      )}
    </Box>
  );
} 