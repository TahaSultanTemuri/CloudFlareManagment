const express = require("express");
const controller = require("../../controller/cloudflareController");

const router = express.Router();

// ROUTES
router.route("/").post(controller.createSubDomain);
router.route("/updateSubDomain").put(controller.updateSubDomain);
router.route("/pagerule").post(controller.createPageRule);
router.route("/updatePageRule").put(controller.updatePageRule);
router.route("/getPageRules").get(controller.getPageRules);

router.route("/getSubDomains").get(controller.getSubDomains);

router.route('/removeSubdomain/:Id').delete(controller.removeSubDomain);

router.route('/removePageRule/:Id').delete(controller.removePageRule);


 




module.exports = router;
