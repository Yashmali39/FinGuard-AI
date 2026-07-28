import bcrypt from "bcrypt";
import prisma from "../../lib/prisma.js";
import ApiError from "../../utils/ApiError.js";

export const createUser = async (userData) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: userData.email,
        },
    });

    if (existingUser) {
        throw new ApiError(409, "Email already exists.");
    }

    const lastUser = await prisma.user.findFirst({
        orderBy: {
            createdAt: "desc",
        },
    });

    let nextUserId = "EMP0001";

    if (lastUser) {
        const currentNumber = parseInt(
            lastUser.userId.substring(3)
        );

        nextUserId =
            "EMP" +
            String(currentNumber + 1).padStart(4, "0");
    }

    const hashedPassword = await bcrypt.hash(
        userData.password,
        10
    );

    const user = await prisma.user.create({
        data: {
            userId: nextUserId,
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: userData.role,
            department: userData.department,
        },
    });

    const { password, ...employee } = user;

    return employee;
};