const { event, ticket } = require("../models");
const { Op, where } = require("sequelize");

exports.getAllEvent = async (req, res) => {
  try {
    const eventData = await event.findAll({
      attributes: [
        "id",
        "event_name",
        "jam_mulai",
        "jam_selesai",
        "venue",
        "date",
        "picture",
        "guest",
      ],
      where: {
        status: {
          [Op.ne]: "hide",
        },
      },
      order: [["id", "ASC"]],
    });
    res.status(200).json({
      success: true,
      message: "List All Events Data",
      data: eventData,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const eventData = await event.findOne({
      attributes: [
        "id",
        "event_name",
        "jam_mulai",
        "jam_selesai",
        "venue",
        "date",
        "picture",
        "guest",
        "description",
        "syarat",
      ],
      where: {
        id: eventId,
        status: {
          [Op.ne]: "hide",
        },
      },
    });
    const ticketData = await ticket.findAll({
      where: {
        id_event: eventId,
      },
    });

    if (!eventData) {
      return res.status(404).json({
        success: false,
        message: `Event with ID ${eventId} not found or hidden`,
      });
    }

    let parameter = {
      eventData,
      ticketData,
    };

    res.status(200).json({
      success: true,
      message: `Events Data Id ${eventId}`,
      data: parameter,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllEventAdmin = async (req, res) => {
  try {
    const eventData = await event.findAll({
      attributes: [
        "id",
        "event_name",
        "jam_mulai",
        "jam_selesai",
        "venue",
        "date",
        "picture",
        "guest",
        "description",
        "syarat",
        "status",
      ],
      order: [["id", "ASC"]],
    });
    res.status(200).json({
      success: true,
      message: "List All Events Data",
      data: eventData,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getEventByIdAdmin = async (req, res) => {
  try {
    const { eventId } = req.params;
    const eventData = await event.findOne({
      attributes: [
        "id",
        "event_name",
        "jam_mulai",
        "jam_selesai",
        "venue",
        "date",
        "picture",
        "guest",
        "description",
        "syarat",
        "status",
      ],
      where: {
        id: eventId,
      },
    });

    if (!eventData) {
      return res.status(404).json({
        success: false,
        message: `Event with ID ${eventId} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Events Data Id ${eventId}`,
      data: eventData,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const eventData = await event.destroy({
      where: {
        id: eventId,
      },
    });

    res.status(200).json({
      success: true,
      message: `Events Data Id ${eventId} successfully deleted`,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.createTicket = async (req, res) => {
  const { eventId } = req.params;
  const { name, price, status } = req.body;

  const ticketExisted = await ticket.findOne({
    where: {
      name: name,
      id_event: eventId,
    },
  });

  const eventExisted = await event.findOne({
    where: {
      id: eventId,
    },
  });

  if (!eventExisted) {
    return res.status(400).json({
      status: false,
      msg: "Events did not exists",
    });
  }

  if (ticketExisted) {
    return res.status(400).json({
      status: false,
      msg: "Ticket already exists",
    });
  }

  try {
    let ticketData = await ticket.create({
      id_event: eventId,
      name: name,
      price: price,
      status: status,
    });

    res.status(200).json({
      success: true,
      message: `Ticket Data Event Id ${eventId} Successfully Added`,
      data: ticketData,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.editTicket = async (req, res) => {
  const { eventId, ticketId } = req.params;
  const { name, price, status } = req.body;

  const ticketExisted = await ticket.findOne({
    where: {
      id: ticketId,
    },
  });

  const eventExisted = await event.findOne({
    where: {
      id: eventId,
    },
  });

  if (!ticketExisted || !eventExisted) {
    return res.status(400).json({
      status: false,
      msg: "Ticket data or event data not found",
    });
  }

  try {
    let ticketData = await ticket.update(
      {
        name: name,
        price: price,
        status: status,
      },
      {
        where: {
          id: ticketId,
          id_event: eventId,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: `Ticket Data Id ${ticketId} Event Id ${eventId} Successfully Updated`,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteTicket = async (req, res) => {
  const { eventId, ticketId } = req.params;

  try {
    let ticketData = await ticket.destroy({
      where: {
        id: ticketId,
        id_event: eventId,
      },
    });

    res.status(200).json({
      success: true,
      message: `Ticket Data Id ${ticketId} Event Id ${eventId} Successfully Deleted`,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getTicket = async (req, res) => {
  const { eventId } = req.params;

  try {
    let ticketData = await ticket.findAll({
      attributes: ["id", "name", "price", "status"],
      order: [["id", "ASC"]],
      where: {
        id_event: eventId,
      },
    });

    let eventData = await event.findOne({
      attributes: ["event_name"],
      where: {
        id: eventId,
      },
    });

    if (!eventData) {
      return res.status(404).json({
        success: false,
        message: `Event with ID ${eventId} not found`,
        data: null,
      });
    }

    let parameter = {
      eventData,
      ticketData,
    };

    res.status(200).json({
      success: true,
      message: `Ticket Data Event Id ${eventId}`,
      data: parameter,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getTicketById = async (req, res) => {
  const { eventId } = req.params;
  const { ticketId } = req.params;

  try {
    let eventData = await event.findOne({
      attributes: ["event_name"],
      where: {
        id: eventId,
      },
    });

    if (!eventData) {
      return res.status(404).json({
        success: false,
        message: `Event with ID ${eventId} not found`,
        data: null,
      });
    }

    let ticketData = await ticket.findAll({
      attributes: ["id", "name", "price", "status"],
      where: {
        id_event: eventId,
        id: ticketId,
      },
    });

    if (!ticketData.length) {
      return res.status(404).json({
        success: false,
        message: `No tickets found for Event ID ${eventId}`,
        data: null,
      });
    }

    let parameter = {
      eventData,
      ticketData,
    };

    res.status(200).json({
      success: true,
      message: `Ticket Data Event Id ${eventId}, ticket Id ${ticketId}`,
      data: parameter,
    });
  } catch (error) {
    console.log(error);
  }
};
