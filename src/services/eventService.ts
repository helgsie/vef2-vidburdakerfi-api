import prisma from "../prisma/prisma";

export const getAllEvents = async () => {
  return await prisma.event.findMany();
};

export const getEventById = async (id: number) => {
  return await prisma.event.findUnique({ where: { id } });
};

export const createEvent = async (data: any) => {
  return await prisma.event.create({ data });
};

export const deleteEvent = async (id: number) => {
  return await prisma.event.delete({ where: { id } });
};

export const signUpForEvent = async (eventId: number, userId: number) => {
  return await prisma.event.update({
    where: { id: eventId },
    data: { attendees: { connect: { id: userId } } },
  });
};

export const signOutOfEvent = async (eventId: number, userId: number) => {
  return await prisma.event.update({
    where: { id: eventId },
    data: { attendees: { disconnect: { id: userId } } },
  });
};