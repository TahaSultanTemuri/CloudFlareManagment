const mailService = require("../service/mailService");

exports.sendMail = async (req, res, next) => {
  const from = req.body.from;
  const to = req.body.to;
  const subject = req.body.subject;
  const type = req.body.type; // type can be of html or text
  const value = req.body.value;

  const sent = mailService.throughMail(from, to, subject, type, value);

  if(sent){
    res.status(200).json({
      status: "success",
      message: `Mail been sended to ${to} from ${from}`,
    });
  }else{
    res.status(400).json({
      status: "fail",
      message: `Mail could not be sent to ${to} from ${from}`,
    });
  }
};