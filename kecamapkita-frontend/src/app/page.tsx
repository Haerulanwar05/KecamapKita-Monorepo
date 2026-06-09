"use client";

import { useState } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import ExploreTab from '@/components/ExploreTab';
import AdventureTab from '@/components/AdventureTab';
import AiNeighborTab from '@/components/AiNeighborTab';
import Toast from '@/components/Toast';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'explore' | 'adventure' | 'ai-neighbor'>('explore');

  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col overflow-y-auto relative">
        <ExploreTab isActive={activeTab === 'explore'} />
        <AdventureTab isActive={activeTab === 'adventure'} />
        <AiNeighborTab isActive={activeTab === 'ai-neighbor'} />
      </main>
      <Toast />
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
}
