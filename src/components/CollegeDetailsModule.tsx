import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Building2, 
  MapPin, 
  ExternalLink, 
  TrendingUp, 
  Award, 
  Search, 
  Users, 
  Briefcase, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronRight,
  DollarSign,
  GraduationCap,
  X,
  Globe
} from 'lucide-react';
import { AP_TOP_COLLEGES_DATABASE, AP_DISTRICTS, APCollegeDetails, PlacementYearRecord } from '@/lib/apCollegesData';

interface CollegeDetailsModuleProps {
  title?: string;
  subtitle?: string;
}

export default function CollegeDetailsModule({ title, subtitle }: CollegeDetailsModuleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedMinPlacement, setSelectedMinPlacement] = useState<number>(0);
  const [selectedCollegeForPlacementModal, setSelectedCollegeForPlacementModal] = useState<APCollegeDetails | null>(null);

  // Filtered colleges list
  const filteredColleges = AP_TOP_COLLEGES_DATABASE.filter((college) => {
    // District filter
    if (selectedDistrict !== 'ALL' && !college.district.toLowerCase().includes(selectedDistrict.toLowerCase())) {
      return false;
    }

    // Type filter
    if (selectedType !== 'ALL' && college.type !== selectedType) {
      return false;
    }

    // Min Placement percentage filter
    const latestPlacement = college.placements[0]?.placementPercentage || 0;
    if (selectedMinPlacement > 0 && latestPlacement < selectedMinPlacement) {
      return false;
    }

    // Text search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = college.name.toLowerCase().includes(q);
      const matchShortName = college.shortName.toLowerCase().includes(q);
      const matchCode = college.code.toLowerCase().includes(q);
      const matchLoc = college.location.toLowerCase().includes(q);
      const matchDist = college.district.toLowerCase().includes(q);
      const matchRecruiter = college.placements.some(p => p.topRecruiters.some(r => r.toLowerCase().includes(q)));
      
      if (!matchName && !matchShortName && !matchCode && !matchLoc && !matchDist && !matchRecruiter) {
        return false;
      }
    }

    return true;
  });

  return (
    <Card className="border border-border shadow-sm bg-card overflow-hidden">
      <CardHeader className="bg-muted/10 border-b border-border/50 py-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <Badge variant="outline" className="text-primary hover:bg-transparent bg-primary/5 border-primary/20 text-xs px-2.5 py-0.5 font-semibold">
                AP College Directory & Placement Portal
              </Badge>
              <Badge className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 font-bold">
                50 Top Colleges
              </Badge>
              <span className="text-[10px] text-muted-foreground">• Real-time Placement Archives</span>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              {title || "Top Engineering Colleges & University Campuses of Andhra Pradesh"}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm mt-1">
              {subtitle || "Explore 50 top colleges of AP, historic year-wise placement metrics (2025, 2024, 2023), recruiting companies, NIRF ratings, and direct links to official college portals."}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card p-3 rounded-lg border border-border/60 shadow-xs">
            <GraduationCap className="h-5 w-5 text-primary shrink-0" />
            <div>
              <span className="font-bold text-foreground">50 Institutes Listed</span>
              <p className="text-[11px] text-muted-foreground">Updated for 2025 Placements</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Search & Filtering Controls */}
        <div className="bg-muted/30 p-5 rounded-xl border border-border/60 mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-end">
          <div className="space-y-1.5">
            <Label htmlFor="college-search" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Search Colleges / Companies
            </Label>
            <div className="relative">
              <Input
                id="college-search"
                placeholder="Search college, code, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-xs border-border bg-card font-medium"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="district-filter" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              District / Region
            </Label>
            <select
              id="district-filter"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full h-9 rounded-md border border-border bg-card px-3 py-1 text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-primary font-medium"
            >
              <option value="ALL">All Districts (AP)</option>
              {AP_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="type-filter" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Institute Category
            </Label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full h-9 rounded-md border border-border bg-card px-3 py-1 text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-primary font-medium"
            >
              <option value="ALL">All Categories</option>
              <option value="University">Universities (State / Deemed)</option>
              <option value="Autonomous">Autonomous Colleges</option>
              <option value="Private">Private Engineering Colleges</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="placement-filter" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Min Placement Rate
            </Label>
            <select
              id="placement-filter"
              value={selectedMinPlacement}
              onChange={(e) => setSelectedMinPlacement(Number(e.target.value))}
              className="w-full h-9 rounded-md border border-border bg-card px-3 py-1 text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-primary font-medium"
            >
              <option value={0}>Any Placement Rate</option>
              <option value={90}>90% and Above</option>
              <option value={85}>85% and Above</option>
              <option value={80}>80% and Above</option>
            </select>
          </div>
        </div>

        {/* Results summary bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 pb-2 border-b border-border/40 text-xs text-muted-foreground">
          <div>
            Showing <strong className="text-foreground">{filteredColleges.length}</strong> of <strong className="text-foreground">{AP_TOP_COLLEGES_DATABASE.length}</strong> colleges in Andhra Pradesh
          </div>
          {(searchQuery || selectedDistrict !== 'ALL' || selectedType !== 'ALL' || selectedMinPlacement > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedDistrict('ALL');
                setSelectedType('ALL');
                setSelectedMinPlacement(0);
              }}
              className="h-6 text-[11px] text-primary hover:bg-primary/5 px-2"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* College Cards Grid */}
        {filteredColleges.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-xl bg-muted/10 flex flex-col items-center gap-2">
            <Building2 className="h-10 w-10 text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-base">No colleges matched your filters</p>
            <p className="text-xs text-muted-foreground max-w-sm px-4">
              Try broadening your search query or selecting "All Districts" to view colleges across Andhra Pradesh.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredColleges.map((college) => {
              const latestPlacement = college.placements[0];

              return (
                <div
                  key={college.id}
                  className="flex flex-col border border-border rounded-xl bg-card hover:bg-muted/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group relative overflow-hidden"
                >
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Card Header badges */}
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider rounded h-5 bg-muted border border-border/50 text-foreground">
                            {college.code}
                          </Badge>
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 text-[10px] h-5 px-2 font-bold">
                            NAAC {college.naacRating}
                          </Badge>
                          {college.nirfRank && (
                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                              {college.nirfRank}
                            </Badge>
                          )}
                        </div>

                        <Badge variant="outline" className="text-[10px] uppercase text-muted-foreground font-semibold shrink-0">
                          {college.type}
                        </Badge>
                      </div>

                      {/* College Name & Location */}
                      <h4 className="font-bold text-base text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors" title={college.name}>
                        {college.name}
                      </h4>

                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{college.location} ({college.district})</span>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                        {college.description}
                      </p>

                      {/* Past Year Placement Highlight Box */}
                      {latestPlacement && (
                        <div className="bg-muted/30 p-3.5 rounded-lg border border-border/50 text-xs mb-4 space-y-2">
                          <div className="flex justify-between items-center border-b border-border/40 pb-2">
                            <span className="text-muted-foreground font-semibold flex items-center gap-1 text-[11px]">
                              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                              {latestPlacement.year} Placements Snapshot:
                            </span>
                            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono text-[10px] font-bold">
                              {latestPlacement.placementPercentage}% Placed
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-center pt-1">
                            <div className="p-1.5 bg-card rounded border border-border/40">
                              <span className="text-[10px] text-muted-foreground block">Highest Package</span>
                              <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-xs">
                                ₹{latestPlacement.highestPackageLPA} LPA
                              </strong>
                            </div>
                            <div className="p-1.5 bg-card rounded border border-border/40">
                              <span className="text-[10px] text-muted-foreground block">Average Package</span>
                              <strong className="text-foreground font-mono text-xs">
                                ₹{latestPlacement.averagePackageLPA} LPA
                              </strong>
                            </div>
                          </div>

                          {/* Top Recruiters pills */}
                          <div className="pt-1">
                            <span className="text-[10px] text-muted-foreground font-medium block mb-1">Top Recruiters:</span>
                            <div className="flex flex-wrap gap-1">
                              {latestPlacement.topRecruiters.slice(0, 4).map((recruiter, idx) => (
                                <span
                                  key={idx}
                                  className="text-[9px] px-1.5 py-0.5 rounded bg-muted/60 text-foreground font-medium border border-border/40"
                                >
                                  {recruiter}
                                </span>
                              ))}
                              {latestPlacement.topRecruiters.length > 4 && (
                                <span className="text-[9px] px-1 py-0.5 text-muted-foreground">
                                  +{latestPlacement.topRecruiters.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCollegeForPlacementModal(college)}
                        className="h-8 text-xs font-semibold gap-1.5 border-border hover:bg-muted text-foreground"
                      >
                        <Briefcase className="h-3.5 w-3.5 text-primary" />
                        Placement History
                      </Button>

                      <a
                        href={college.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
                      >
                        <span>Official Website</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Past Placement History Modal */}
        {selectedCollegeForPlacementModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-card border border-border rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-5">
              <div className="flex justify-between items-start border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs font-mono">{selectedCollegeForPlacementModal.code}</Badge>
                    <Badge className="bg-emerald-600 text-white text-xs">NAAC {selectedCollegeForPlacementModal.naacRating}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{selectedCollegeForPlacementModal.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {selectedCollegeForPlacementModal.location} ({selectedCollegeForPlacementModal.district} District)
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedCollegeForPlacementModal(null)}
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* General College Information */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/30 p-3.5 rounded-lg border border-border/50 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Est. Year</span>
                  <strong className="font-medium text-foreground">{selectedCollegeForPlacementModal.establishedYear}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">EAMCET Code</span>
                  <strong className="font-mono text-primary">{selectedCollegeForPlacementModal.eamcetCode}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Annual Fee Range</span>
                  <strong className="font-medium text-foreground">{selectedCollegeForPlacementModal.annualFeeRange}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Campus Type</span>
                  <strong className="font-medium text-foreground">{selectedCollegeForPlacementModal.type}</strong>
                </div>
              </div>

              {/* Multi-Year Past Placements Section */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-emerald-600" />
                  Past Years Placement Statistics (2025, 2024, 2023)
                </h4>

                <div className="space-y-3">
                  {selectedCollegeForPlacementModal.placements.map((record) => (
                    <div key={record.year} className="p-4 rounded-lg border border-border bg-muted/10 space-y-3">
                      <div className="flex justify-between items-center border-b border-border/40 pb-2">
                        <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-primary" />
                          Academic Year {record.year}
                        </span>
                        <Badge className="bg-emerald-600 text-white font-mono text-xs">
                          {record.placementPercentage}% Selection Rate
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        <div className="p-2 bg-card rounded border border-border/40">
                          <span className="text-[10px] text-muted-foreground block">Eligible Students</span>
                          <strong className="font-mono text-foreground">{record.totalStudentsEligible}</strong>
                        </div>
                        <div className="p-2 bg-card rounded border border-border/40">
                          <span className="text-[10px] text-muted-foreground block">Students Placed</span>
                          <strong className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{record.studentsPlaced}</strong>
                        </div>
                        <div className="p-2 bg-card rounded border border-border/40">
                          <span className="text-[10px] text-muted-foreground block">Highest Package</span>
                          <strong className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">₹{record.highestPackageLPA} LPA</strong>
                        </div>
                        <div className="p-2 bg-card rounded border border-border/40">
                          <span className="text-[10px] text-muted-foreground block">Average Package</span>
                          <strong className="font-mono text-foreground font-bold">₹{record.averagePackageLPA} LPA</strong>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-muted-foreground block mb-1.5">Major Recruiting Companies:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {record.topRecruiters.map((recruiter, rIdx) => (
                            <Badge key={rIdx} variant="secondary" className="text-xs px-2 py-0.5 bg-card border border-border/60">
                              {recruiter}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-border flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCollegeForPlacementModal(null)}
                >
                  Close Window
                </Button>

                <a
                  href={selectedCollegeForPlacementModal.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
                >
                  <Globe className="h-4 w-4" />
                  Visit Official College Portal ↗
                </a>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
