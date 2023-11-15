/** @format */

const getPost = async (id) => {
  const res = await fetch("/postDetail.json").then((res) => res.json());
  const detail = res[id];

  return detail;
};

export default getPost;
