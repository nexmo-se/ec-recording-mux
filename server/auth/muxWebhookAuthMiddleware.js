
const muxWebhookAuthMiddleware = async (req, res, next) => {
    try {
        const sig = req.headers['mux-signature'];
        // will raise an exception if the signature is invalid
        const isValidSignature = Webhooks.verifyHeader(
          req.body,
          sig,
          webhookSecret
        );
        console.log('Success:', isValidSignature);
        next()
      } catch (err) {
        // On error, return the error message
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
};

module.exports = muxWebhookAuthMiddleware;
