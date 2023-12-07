const { event } = require("../models");

exports.createEvent = async (req, res) => {
  const {
    event_name,
    jam_mulai,
    jam_selesai,
    venue,
    date,
    picture,
    guest,
    description,
  } = req.body;
  try {
    let eventData = await event.create({
      event_name: event_name,
      jam_mulai: jam_mulai,
      jam_selesai: jam_selesai,
      venue: venue,
      date: date,
      picture: picture,
      guest: guest,
      description: description,
      status: "active",
    });

    eventData = JSON.parse(JSON.stringify(eventData));

    return res.status(200).json({
      success: true,
      message: "Create Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
