/**
 * projects.js — Re-exports systemsConfig from lib/config.js
 * Master data is centralized in lib/config.js.
 */
import { systemsConfig } from "./config";

export const projects = systemsConfig;
