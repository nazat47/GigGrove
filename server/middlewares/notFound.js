export const routeNotFound = (req, res) => {
  return res.status(404).send("Route not found");
};
