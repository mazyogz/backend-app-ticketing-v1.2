const { event } = require("../models");
const { Op } = require("sequelize")

exports.getAllEvent = async (req, res) => {
  try {
    const eventData = await event.findAll({
      attributes: ['id','event_name', 'jam_mulai', 'jam_selesai', 'venue', 'date', 'picture', 'guest'],
      where: {
        status: {
          [Op.ne]: 'hide',
        },
      },
      order: [['id', 'ASC']],
    });
    res.status(200).json({
      success: true,
      message: 'List All Events Data',
      data: eventData,
    });
  } catch (error) {
    console.log(error)
  }
}

exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const eventData = await event.findOne({
      attributes: ['id','event_name', 'jam_mulai', 'jam_selesai', 'venue', 'date', 'picture', 'guest'],
      where: {
        id: eventId,
        status: {
          [Op.ne]: 'hide',
        },
      }
    });

    if (!eventData) {
      return res.status(404).json({
        success: false,
        message: `Event with ID ${eventId} not found or hidden`,
      });
    };

    res.status(200).json({
      success: true,
      message: `Events Data Id ${eventId}`,
      data: eventData,
    });
  } catch (error) {
    console.log(error)
  }
}

exports.getAllEventAdmin = async (req, res) => {
  try {
    const eventData = await event.findAll({
      attributes: ['id','event_name', 'jam_mulai', 'jam_selesai', 'venue', 'date', 'picture', 'guest', 'description', 'syarat', 'status'],
      order: [['id', 'ASC']],
    });
    res.status(200).json({
      success: true,
      message: 'List All Events Data',
      data: eventData,
    });
  } catch (error) {
    console.log(error)
  }
}

exports.getEventByIdAdmin = async (req, res) => {
  try {
    const { eventId } = req.params;
    const eventData = await event.findOne({
      attributes: ['id','event_name', 'jam_mulai', 'jam_selesai', 'venue', 'date', 'picture', 'guest', 'description', 'syarat', 'status'],
      where: {
        id: eventId,
      }
    });

    if (!eventData) {
      return res.status(404).json({
        success: false,
        message: `Event with ID ${eventId} not found`,
      });
    };

    res.status(200).json({
      success: true,
      message: `Events Data Id ${eventId}`,
      data: eventData,
    });
  } catch (error) {
    console.log(error)
  }
}
