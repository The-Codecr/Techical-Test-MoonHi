const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3001;

app.use(cors());
app.use(express.json());

function calculate(num1, num2, operation) {
  switch (operation) {
    case 'addition':
      return num1 + num2;
    case 'subtraction':
      return num1 - num2;
    case 'multiplication':
      return num1 * num2;
    case 'division':
      if (num2 === 0) {
        throw new Error('Division by zero is not allowed :(');
      }
      return num1 / num2;
    default:
      throw new Error('Invalid operation!');
  }
}

app.post('/api/calculate', (req, res) => {
  const { num1, num2, operation } = req.body;

  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    return res.status(400).json({
      error: 'Invalid input, both num1 and num2 should be numbers. :(',
    });
  }

  if (!['addition', 'subtraction', 'multiplication', 'division'].includes(operation)) {
    return res.status(400).json({
      error: 'Invalid operation, must be one of: addition, subtraction, multiplication, division.',
    });
  }

  try {
    const result = calculate(num1, num2, operation);
    return res.status(200).json({
      operation,
      num1,
      num2,
      result,
      timestamp: new Date(),
    
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});