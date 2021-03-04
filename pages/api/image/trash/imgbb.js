import wrapper from 'utils/wrapper';

/*************************************/

const handler = (req, res) => {

  let file  = req.body;
  file = JSON.stringify(file);

  fetch(`https://api.imgbb.com/1/upload?key=5003171e3c1aaacc251d128b561649c`, {
    method: 'POST',
    data: file,
  })
    .then(data => console.log('data', data))
    .catch(err => console.log('err', err))

  return res.json({});
};

export default wrapper(handler);
