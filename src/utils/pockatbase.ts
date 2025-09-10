import { apiPath } from "@/constants";
import pocketbase from "pocketbase";
export const db = new pocketbase(apiPath);
