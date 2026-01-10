import { useState, useEffect } from 'react';
import { Map, Plus } from 'lucide-react';
import { FarmList } from '@/features/farmer/farms/components/FarmList';
import { PlotList } from '@/features/farmer/farms/components/PlotList';
import { CreateFarmModal } from '@/features/farmer/farms/components/CreateFarmModal';
import { CreatePlotModal } from '@/features/farmer/farms/components/CreatePlotModal';
import { farmApi } from '@/features/farmer/farms/api';
import { Farm, Plot, CreateFarmRequest, CreatePlotRequest } from '@/features/farmer/farms/types';
import { Button, Card, CardContent, PageHeader } from '@/shared/ui';
import { toast } from 'sonner';

export default function FarmsPlotsPage() {
    const [farms, setFarms] = useState<Farm[]>([]);
    const [selectedFarm, setSelectedFarm] = useState<Farm | undefined>(undefined);
    const [plots, setPlots] = useState<Plot[]>([]);
    
    // Loading states
    const [isLoadingFarms, setIsLoadingFarms] = useState(true);
    const [isLoadingPlots, setIsLoadingPlots] = useState(false);

    // Modal states
    const [isCreateFarmOpen, setIsCreateFarmOpen] = useState(false);
    const [isCreatePlotOpen, setIsCreatePlotOpen] = useState(false);

    // Fetch initial farms
    const fetchFarms = async () => {
        try {
            setIsLoadingFarms(true);
            const data = await farmApi.getMyFarms();
            setFarms(data);
            
            // Auto-select first farm if none selected
            if (data.length > 0 && !selectedFarm) {
                setSelectedFarm(data[0]);
            }
        } catch (error) {
            console.error('Failed to fetch farms', error);
            toast.error('Failed to load farms');
        } finally {
            setIsLoadingFarms(false);
        }
    };

    useEffect(() => {
        fetchFarms();
    }, []);

    // Fetch plots when selected farm changes
    useEffect(() => {
        if (selectedFarm) {
            const fetchPlots = async () => {
                try {
                    setIsLoadingPlots(true);
                    const data = await farmApi.getPlotsByFarm(selectedFarm.id);
                    setPlots(data);
                } catch (error) {
                    console.error('Failed to fetch plots', error);
                    toast.error('Failed to load plots');
                } finally {
                    setIsLoadingPlots(false);
                }
            };
            fetchPlots();
        } else {
            setPlots([]);
        }
    }, [selectedFarm]);

    const handleCreateFarm = async (data: CreateFarmRequest) => {
        try {
            const newFarm = await farmApi.createFarm(data);
            toast.success('Farm created successfully');
            await fetchFarms();
            setSelectedFarm(newFarm); // Auto select new farm
            setIsCreateFarmOpen(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to create farm');
            throw error;
        }
    };

    const handleCreatePlot = async (data: CreatePlotRequest) => {
        if (!selectedFarm) return;
        try {
            await farmApi.createPlot(selectedFarm.id, data);
            toast.success('Plot created successfully');
            const updatedPlots = await farmApi.getPlotsByFarm(selectedFarm.id);
            setPlots(updatedPlots);
            setIsCreatePlotOpen(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to create plot');
            throw error;
        }
    };

    const canCreatePlot = !!selectedFarm && selectedFarm.active;
    const createPlotTitle = !selectedFarm
        ? 'Select a farm to add plots'
        : selectedFarm.active
            ? 'Create new plot'
            : 'Cannot create plot in inactive farm';

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="max-w-[1920px] mx-auto p-6 flex min-h-screen flex-col gap-6">
                <Card className="mb-6 border border-border rounded-xl shadow-sm">
                    <CardContent className="px-6 py-4">
                        <PageHeader
                            className="mb-0"
                            icon={<Map className="w-8 h-8" />}
                            title="Farms & Plots"
                            subtitle="Manage your farms and plots"
                            actions={
                                <>
                                    <Button onClick={() => setIsCreateFarmOpen(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        New Farm
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsCreatePlotOpen(true)}
                                        disabled={!canCreatePlot}
                                        title={createPlotTitle}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        New Plot
                                    </Button>
                                </>
                            }
                        />
                    </CardContent>
                </Card>

                <div className="flex flex-1 gap-0 min-h-[600px]">
                    {/* Left Pane: Farms List */}
                    <div className="w-1/3 min-w-[350px] max-w-[450px]">
                        <FarmList 
                            farms={farms} 
                            selectedFarmId={selectedFarm?.id}
                            onSelectFarm={setSelectedFarm}
                            isLoading={isLoadingFarms}
                        />
                    </div>

                    {/* Right Pane: Plots List */}
                    <div className="flex-1">
                        <PlotList 
                            farm={selectedFarm} 
                            plots={plots}
                            onCreatePlot={() => setIsCreatePlotOpen(true)}
                            isLoading={isLoadingPlots}
                        />
                    </div>
                </div>

                {/* Modals */}
                <CreateFarmModal 
                    open={isCreateFarmOpen} 
                    onOpenChange={setIsCreateFarmOpen}
                    onSubmit={handleCreateFarm}
                />

                <CreatePlotModal 
                    open={isCreatePlotOpen} 
                    onOpenChange={setIsCreatePlotOpen}
                    onSubmit={handleCreatePlot}
                />
            </div>
        </div>
    );
}
