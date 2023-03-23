const Mux = require('@mux/mux-node');
const { Webhooks } = Mux;
const webhookSecret = process.env.MUX_WEBHOOK_SECRET;


const muxWebhookAuthMiddleware = async (req, res, next) => {
    try {
        const sig = req.headers['mux-signature'];
        const isValidSignature = Webhooks.verifyHeader(
          JSON.stringify(req.body),
          sig,
          webhookSecret
        );
        next()
      } catch (err) {
        // On error, return the error message
        console.log('Webhook Fail:', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
};

module.exports = muxWebhookAuthMiddleware;
