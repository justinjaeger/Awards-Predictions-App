import wrapper from 'utils/wrapper';
import axios from 'axios';

const key = process.env.IMGBB_API_KEY;
const url = 'https://api.imgbb.com/1/upload';

const handler = async (req, res) => {
  const image = req.body.image;
  await axios.post(`${url}&key=${key}`, {image})
};

export default wrapper(handler);
