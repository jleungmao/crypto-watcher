

exports.getMain = (req, res, next) => {
    res.status(200).json({ message: "Successfully reached main page" });
};