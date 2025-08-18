/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { motion } from "framer-motion";
import { X, Calendar, User, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { FilterState } from "@/types/types";

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: any) => void;
  onClose: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onClose,
}) => {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      dateRange: "all",
      creator: "all",
      minEdits: 0,
      maxEdits: 100,
      sortBy: "updated",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Advanced Filters
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Date Range Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Label>
            <Select
              value={filters.dateRange}
              onValueChange={(value: string) =>
                handleFilterChange("dateRange", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Creator Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <User className="w-4 h-4 mr-2" />
              Creator
            </Label>
            <Select
              value={filters.creator}
              onValueChange={(value: string) =>
                handleFilterChange("creator", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Creators</SelectItem>
                <SelectItem value="me">My Templates</SelectItem>
                <SelectItem value="team">Team Templates</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Edit Count Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Edit Count: {filters.minEdits} - {filters.maxEdits}
            </Label>
            <div className="px-2">
              <Slider
                value={[filters.minEdits ?? 0, filters.maxEdits ?? 0]}
                onValueChange={([min, max]) => {
                  handleFilterChange("minEdits", min);
                  handleFilterChange("maxEdits", max);
                }}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value: string) =>
                handleFilterChange("sortBy", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last Updated</SelectItem>
                <SelectItem value="created">Date Created</SelectItem>
                <SelectItem value="name">Template Name</SelectItem>
                <SelectItem value="edits">Most Edited</SelectItem>
                <SelectItem value="exports">Most Exported</SelectItem>
                <SelectItem value="copies">Most Copied</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
