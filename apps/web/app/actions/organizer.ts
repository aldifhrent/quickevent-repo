import { api } from "@/lib/api";
import { organizerValues } from "@/schema/organizer";

export const createOrganizer = async (values: organizerValues, token: string) => {
    return await api(
        "/organizer/new",
        "POST",
        {
            body: values,
            contentType: "application/json",
        },
        token
    );
};
