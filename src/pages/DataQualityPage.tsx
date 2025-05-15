import React, { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox"; // Not used in this simplified version yet
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Gem, Minimize, GitFork, Plus, Play, BarChart2, Download, ListChecks, Star } from 'lucide-react'; // 将 ProjectDiagram 改为 GitFork
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Common styles for this page
const formGroupClass = "mb-4"; // Adjusted margin
const formLabelClass = "block mb-1.5 text-sm font-medium text-text-primary-html";
const formControlBaseClass = "w-full px-3 py-2 rounded-lg border-gray-300 bg-white text-sm text-text-primary-html placeholder:text-text-light-html focus:border-primary-dark focus:ring-1 focus:ring-primary-dark/50";
const cardTitleClass = "text-lg font-semibold text-text-primary-html flex items-center";
const cardHeaderClass = "px-6 py-4 border-b border-gray-200 flex justify-between items-center";
const cardBodyClass = "p-6";
const cardClass = "bg-white rounded-xl shadow-md border border-gray-200";

// Mock Task Card Component (can be extracted later)
interface TaskCardProps {
  title: string;
  status: '已完成' | '运行中' | '待开始';
  statusType: 'success' | 'primary' | 'warning';
  datasetName: string;
  date: string;
  progress?: number; // 0-100
  resultCount?: string; // e.g., "1,240 → 372"
  duration?: string; // e.g., "23 分钟"
  onViewResults?: () => void;
  onDownload?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title, status, statusType, datasetName, date, progress, resultCount, duration, onViewResults, onDownload
}) => {
  const getStatusTagColor = () => {
    if (statusType === 'success') return 'bg-success-html/10 text-green-700';
    if (statusType === 'primary') return 'bg-primary-dark/10 text-primary-dark';
    return 'bg-warning-html/10 text-yellow-700';
  };
  return (
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-text-primary-html">{title}</h4>
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusTagColor()}`}>{status}</span>
      </div>
      <p className="text-xs text-text-secondary-html mb-1">数据集: {datasetName}</p>
      <p className="text-xs text-text-secondary-html mb-3">日期: {date}</p>
      {progress !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
          <div className="bg-primary-html h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      )}
      {(resultCount || duration) && (
        <div className="flex justify-between text-xs text-text-secondary-html mt-2 mb-3">
          {resultCount && <span><ListChecks size={12} className="inline mr-1"/>{resultCount}</span>}
          {duration && <span><Play size={12} className="inline mr-1"/>{duration}</span>}
        </div>
      )}
      <div className="flex justify-end space-x-2 mt-2">
        {onViewResults && <Button variant="outline" size="xs" onClick={onViewResults}><BarChart2 size={14} className="mr-1"/>结果</Button>}
        {onDownload && <Button variant="outline" size="xs" onClick={onDownload}><Download size={14} className="mr-1"/>下载</Button>}
      </div>
    </div>
  );
};


const DataQualityPage: React.FC = () => {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [currentMethod, setCurrentMethod] = useState<'cherry' | 'less' | 'limr' | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  
  // States for Cherry form (example)
  const [cherryDataset, setCherryDataset] = useState("generated_data_20240510.jsonl");
  const [cherryModel, setCherryModel] = useState("gpt4");
  const [cherryRatio, setCherryRatio] = useState(30);
  const [cherryCriteria, setCherryCriteria] = useState("评估标准:\n1. 指令清晰度和具体性\n2. 回答的详细程度和准确性\n3. 内容的多样性和创造性\n4. 是否存在有害或不适内容");

  const openConfigModal = (method: 'cherry' | 'less' | 'limr') => {
    setCurrentMethod(method);
    if (method === 'cherry') setModalTitle('配置 Cherry 数据筛选');
    // Add titles for less and limr
    setIsConfigModalOpen(true);
  };

  const openResultsModal = (method: 'cherry' | 'less' | 'limr', taskId: string) => {
    setCurrentMethod(method);
    setModalTitle(`${method.toUpperCase()} 任务结果: ${taskId}`);
    // Fetch or set results content here
    setIsResultsModalOpen(true);
  };
  
  // Simplified render functions for tab content to keep main component cleaner
  const renderCherryContent = () => (
    <div className={cardClass} style={{ marginTop: '1.5rem', boxShadow: 'none' }}>
      <div className={cardHeaderClass}>
        <h3 className={cardTitleClass}><Gem size={18} className="mr-2 text-primary-dark" /> Cherry 高质量数据筛选</h3>
        <Button size="sm" className="text-xs" onClick={() => openConfigModal('cherry')}><Plus size={14} className="mr-1.5" /> 创建新筛选任务</Button>
      </div>
      <div className={cardBodyClass}>
        <p className="text-sm text-text-secondary-html mb-4">Cherry 方法使用 LLM 评估每个数据样本的质量，并筛选出最优质的子集。适用于提升微调数据集的整体质量。</p>
        {/* Form for quick start (can be part of the modal or inline) */}
        <div className="space-y-4 mb-6 p-4 border rounded-md bg-slate-50">
            <div className={formGroupClass}>
                <Label htmlFor="cherry-dataset-inline" className={formLabelClass}>筛选数据集</Label>
                <Select value={cherryDataset} onValueChange={setCherryDataset}>
                    <SelectTrigger id="cherry-dataset-inline" className={formControlBaseClass}><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="generated_data_20240510.jsonl">generated_data_20240510.jsonl</SelectItem>
                        <SelectItem value="merged_dataset.jsonl">merged_dataset.jsonl</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={formGroupClass}>
                    <Label htmlFor="cherry-model-inline" className={formLabelClass}>评估模型</Label>
                    <Select value={cherryModel} onValueChange={setCherryModel}>
                        <SelectTrigger id="cherry-model-inline" className={formControlBaseClass}><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="gpt4">GPT-4</SelectItem>
                            <SelectItem value="claude3opus">Claude-3-Opus</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className={formGroupClass}>
                    <Label htmlFor="cherry-ratio-inline" className={formLabelClass}>保留比例 ({cherryRatio}%)</Label>
                    <Input type="range" id="cherry-ratio-inline" min="1" max="100" value={cherryRatio} onChange={(e: ChangeEvent<HTMLInputElement>) => setCherryRatio(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-dark"/>
                </div>
            </div>
            <div className="flex justify-end">
                <Button size="sm" onClick={() => console.log("Start Cherry Task with inline config")}><Play size={14} className="mr-1.5" /> 开始筛选</Button>
            </div>
        </div>
        <h4 className="text-md font-semibold text-text-primary-html mb-3">历史筛选任务</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TaskCard title="高质量指令筛选" status="已完成" statusType="success" datasetName="generated_data_20240506.jsonl" date="2024-05-08" progress={100} resultCount="1,240 → 372" duration="23 分钟" onViewResults={() => openResultsModal('cherry', 'task1')} onDownload={() => console.log("Download cherry task1")} />
          {/* Add more mock tasks */}
        </div>
      </div>
    </div>
  );

  // Placeholder render functions for Less and LIMR
  const renderLessContent = () => (
    <div className={cardClass} style={{ marginTop: '1.5rem', boxShadow: 'none' }}>
      <div className={cardHeaderClass}>
        <h3 className={cardTitleClass}><Minimize size={18} className="mr-2 text-primary-dark" /> Less 智能数据去重</h3>
        <Button size="sm" className="text-xs" onClick={() => openConfigModal('less')}><Plus size={14} className="mr-1.5" /> 创建新去重任务</Button>
      </div>
      <div className={cardBodyClass}><p className="text-sm text-text-secondary-html">Less 方法内容待实现。</p></div>
    </div>
  );
  const renderLimrContent = () => (
    <div className={cardClass} style={{ marginTop: '1.5rem', boxShadow: 'none' }}>
      <div className={cardHeaderClass}>
        <h3 className={cardTitleClass}><GitFork size={18} className="mr-2 text-primary-dark" /> LIMR 数据语义对齐</h3>
        <Button size="sm" className="text-xs" onClick={() => openConfigModal('limr')}><Plus size={14} className="mr-1.5" /> 创建新对齐任务</Button>
      </div>
      <div className={cardBodyClass}><p className="text-sm text-text-secondary-html">LIMR 方法内容待实现。</p></div>
    </div>
  );


  return (
    <div className="space-y-6">
      <div className={cardClass}>
        <div className={cardHeaderClass}>
          <h2 className="text-xl font-semibold text-text-primary-html flex items-center">
            <Star size={22} className="mr-3 text-primary-dark" />
            数据质量评估方法
          </h2>
        </div>
        <div className={cardBodyClass}>
          <div className="flex items-start p-4 mb-6 rounded-xl bg-info-html/10 text-info-html border border-blue-300">
            <AlertCircle size={20} className="mr-3 mt-0.5 flex-shrink-0" />
            <div>Datapresso 提供三种特有的数据质量评估方法：Cherry（数据筛选）、Less（数据去重）和LIMR（数据对齐）。每种方法都针对不同场景优化数据集质量。</div>
          </div>

          <Tabs defaultValue="cherry" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 border-b border-gray-200 rounded-none p-0 bg-transparent">
              <TabsTrigger value="cherry" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary-dark data-[state=active]:text-primary-dark rounded-none text-text-secondary-html hover:text-primary-dark py-3 px-5 font-medium data-[state=active]:bg-transparent">Cherry 数据筛选</TabsTrigger>
              <TabsTrigger value="less" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary-dark data-[state=active]:text-primary-dark rounded-none text-text-secondary-html hover:text-primary-dark py-3 px-5 font-medium data-[state=active]:bg-transparent">Less 数据去重</TabsTrigger>
              <TabsTrigger value="limr" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary-dark data-[state=active]:text-primary-dark rounded-none text-text-secondary-html hover:text-primary-dark py-3 px-5 font-medium data-[state=active]:bg-transparent">LIMR 数据对齐</TabsTrigger>
            </TabsList>

            <TabsContent value="cherry">{renderCherryContent()}</TabsContent>
            <TabsContent value="less">{renderLessContent()}</TabsContent>
            <TabsContent value="limr">{renderLimrContent()}</TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Configuration Modal */}
      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {currentMethod === 'cherry' && (
              <div className="space-y-4">
                <div className={formGroupClass}>
                  <Label htmlFor="cherry-dataset-modal" className={formLabelClass}>筛选数据集</Label>
                  <Select value={cherryDataset} onValueChange={setCherryDataset}>
                      <SelectTrigger id="cherry-dataset-modal" className={formControlBaseClass}><SelectValue /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="generated_data_20240510.jsonl">generated_data_20240510.jsonl</SelectItem>
                          <SelectItem value="merged_dataset.jsonl">merged_dataset.jsonl</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
                <div className={formGroupClass}>
                    <Label htmlFor="cherry-model-modal" className={formLabelClass}>评估模型</Label>
                     <Select value={cherryModel} onValueChange={setCherryModel}>
                        <SelectTrigger id="cherry-model-modal" className={formControlBaseClass}><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="gpt4">GPT-4</SelectItem>
                            <SelectItem value="claude3opus">Claude-3-Opus</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className={formGroupClass}>
                    <Label htmlFor="cherry-ratio-modal" className={formLabelClass}>保留比例 ({cherryRatio}%)</Label>
                    <Input type="range" id="cherry-ratio-modal" min="1" max="100" value={cherryRatio} onChange={(e: ChangeEvent<HTMLInputElement>) => setCherryRatio(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-dark"/>
                </div>
                <div className={formGroupClass}>
                    <Label htmlFor="cherry-criteria-modal" className={formLabelClass}>评估准则</Label>
                    <Textarea id="cherry-criteria-modal" value={cherryCriteria} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCherryCriteria(e.target.value)} rows={4} className={`${formControlBaseClass} min-h-[100px]`} />
                </div>
              </div>
            )}
            {/* Add forms for Less and LIMR here */}
            {currentMethod === 'less' && <p>Less 配置表单待实现。</p>}
            {currentMethod === 'limr' && <p>LIMR 配置表单待实现。</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">取消</Button></DialogClose>
            <Button onClick={() => { console.log(`Save ${currentMethod} config`); setIsConfigModalOpen(false); }}>保存配置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Results Modal */}
       <Dialog open={isResultsModalOpen} onOpenChange={setIsResultsModalOpen}>
        <DialogContent className="sm:max-w-2xl"> {/* Wider for results */}
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
          </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            {/* Placeholder for results content */}
            <p>任务结果展示区域。内容待实现。</p>
            {currentMethod === 'cherry' && <div>Cherry 结果详情...</div>}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">关闭</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default DataQualityPage;