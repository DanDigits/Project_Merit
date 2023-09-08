import { signUp } from "server/mongodb/actions/User";

const handler = async (req, res) => {
  try {
    const user = await signUp(req.body);

    return res.status(200).json({
      success: true,
      payload: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default handler;
