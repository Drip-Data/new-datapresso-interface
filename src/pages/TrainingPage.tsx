import React, { useState, ChangeEvent } from 'react';
import TrainingConfigPanel from '@/components/TrainingConfigPanel'; // 导入训练配置面板
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea'; // Added Textarea import
import { AlertCircle, Brain, Plus, Play, CheckSquare, BarChart2, Download, ListChecks, StopCircle, LucideIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// Common styles (can be centralized if used across more pages)
const formGroupClass = "mb-4";
const formLabelClass = "block mb-1.5 text-sm font-medium text-text-primary-html";
const formControlBaseClass = "w-full px-3 py-2 rounded-lg border-gray-300 bg-white text-sm text-text-primary-html placeholder:text-text-light-html focus:border-primary-dark focus:ring-1 focus:ring-primary-dark/50";
const cardClass = "bg-white rounded-xl shadow-md border border-gray-200";
const cardHeaderClass = "px-6 py-4 border-b border-gray-200 flex justify-between items-center";
const cardBodyClass = "p-6";

// Reusable Task Card (similar to DataQualityPage, consider extracting to a shared component)
interface TrainingTaskCardProps {
  title: string;
  status: '已完成' | '运行中' | '待开始' | '已停止';
  statusType: 'success' | 'primary' | 'warning' | 'danger';
  modelInfo: string; // e.g., "Llama-3-8B SFT"
  date: string;
  epochs?: string; // e.g., "3/3 轮次"
  progress?: number; // 0-100
  sampleCount?: string; // e.g., "642 样本"
  duration?: string; // e.g., "1.5 小时"
  onViewResults?: () => void;
  onDownloadModel?: () => void;
  onViewLogs?: () => void;
  onStopTask?: () => void;
}

const TrainingTaskCard: React.FC<TrainingTaskCardProps> = ({
  title, status, statusType, modelInfo, date, epochs, progress, sampleCount, duration,
  onViewResults, onDownloadModel, onViewLogs, onStopTask
}) => {
  const getStatusTagColor = () => {
    if (statusType === 'success') return 'bg-success-html/10 text-green-700';
    if (statusType === 'primary') return 'bg-primary-dark/10 text-primary-dark';
    if (statusType === 'danger') return 'bg-danger-html/10 text-red-700';
    return 'bg-warning-html/10 text-yellow-700';
  };
  return (
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-text-primary-html">{title}</h4>
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusTagColor()}`}>{status}</span>
      </div>
      <p className="text-xs text-text-secondary-html mb-1">{modelInfo}</p>
      <p className="text-xs text-text-secondary-html mb-3">日期: {date}</p>
      {progress !== undefined && (
        <>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
            <div className="bg-primary-html h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          {epochs && <p className="text-xs text-text-secondary-html text-right mb-1">{epochs} • {progress}%</p>}
        </>
      )}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-secondary-html mt-2 mb-3">
        {sampleCount && <span><ListChecks size={12} className="inline mr-1"/>{sampleCount}</span>}
        {duration && <span><Play size={12} className="inline mr-1"/>{duration}</span>}
      </div>
      <div className="flex justify-end space-x-2 mt-2">
        {onViewLogs && <Button variant="outline" size="xs" onClick={onViewLogs}><ListChecks size={14} className="mr-1"/>日志</Button>}
        {onViewResults && <Button variant="outline" size="xs" onClick={onViewResults}><BarChart2 size={14} className="mr-1"/>结果</Button>}
        {onDownloadModel && status === '已完成' && <Button variant="outline" size="xs" onClick={onDownloadModel}><Download size={14} className="mr-1"/>下载</Button>}
        {onStopTask && status === '运行中' && <Button variant="destructive" size="xs" onClick={onStopTask}><StopCircle size={14} className="mr-1"/>停止</Button>}
      </div>
    </div>
  );
};


const TrainingPage: React.FC = () => {
  // 移除了页面级别的 trainingDataset, baseModel, trainingMethod, computeResource 状态定义
  // 这些配置项将完全由 TrainingConfigPanel 组件管理

  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState<boolean>(false);
  // Mock tasks data
  const [trainingTasks, setTrainingTasks] = useState<TrainingTaskCardProps[]>([
    { title: "指令遵循SFT", status: "已完成", statusType: "success", modelInfo: "Llama-3-8B SFT", date: "2024-05-09", epochs: "3/3 轮次", progress: 100, sampleCount: "642 样本", duration: "1.5 小时", onViewResults: () => alert("View SFT results"), onDownloadModel: () => alert("Download SFT model") },
    { title: "DPO优化", status: "运行中", statusType: "primary", modelInfo: "Llama-3-8B DPO", date: "2024-05-14", epochs: "3/4 轮次", progress: 75, sampleCount: "580 对比", duration: "2.2 小时", onViewLogs: () => alert("View DPO logs"), onStopTask: () => alert("Stop DPO task") },
  ]);

  const handleCreateNewTask = () => {
    // Logic to gather data from a modal form and add to trainingTasks
    // For now, just opens a placeholder modal
    setIsNewTaskModalOpen(true);
  };
  
  // renderTrainingMethodParams 函数已被移除，将由 TrainingConfigPanel 替代

  return (
    <div className="space-y-6">
      <div className={cardClass}>
        <div className={cardHeaderClass}>
          <h2 className="text-3xl font-bold text-text-primary-html flex items-center">
            <Brain size={28} className="mr-3 text-primary-dark" /> {/* Adjusted icon size */}
            模型训练
          </h2>
          <Button size="sm" className="text-xs" onClick={handleCreateNewTask}>
            <Plus size={14} className="mr-1.5" /> 新建训练任务
          </Button>
        </div>
        <div className={cardBodyClass}>
          <div className="flex items-start p-4 mb-6 rounded-xl bg-info-html/10 text-info-html border border-blue-300">
            <AlertCircle size={20} className="mr-3 mt-0.5 flex-shrink-0" />
            <div>使用处理完成的高质量数据集对模型进行训练，支持多种训练方法如监督微调(SFT)、直接偏好优化(DPO)等。</div>
          </div>

          <div className="space-y-4">
            {/* 移除了页面级别的训练数据集、基础模型、训练方法和计算资源选择器 */}
            {/* TrainingConfigPanel 现在负责所有这些配置 */}
            <TrainingConfigPanel />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => console.log("Validate training config")}>
              <CheckSquare size={16} className="mr-2" /> 验证配置
            </Button>
            <Button className="bg-gradient-to-r from-primary-dark to-primary-light hover:opacity-90" onClick={() => console.log("Start training")}>
              <Play size={16} className="mr-2" /> 开始训练
            </Button>
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <div className={cardHeaderClass}>
           <h3 className="text-2xl font-bold text-text-primary-html">训练任务</h3>
        </div>
        <div className={`${cardBodyClass} grid grid-cols-1 md:grid-cols-2 gap-4`}>
          {trainingTasks.map((task: TrainingTaskCardProps) => <TrainingTaskCard key={task.title} {...task} />)}
        </div>
      </div>

      {/* New Training Task Modal (Placeholder) */}
      <Dialog open={isNewTaskModalOpen} onOpenChange={setIsNewTaskModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>新建训练任务</DialogTitle></DialogHeader>
          <div className="py-4">创建新训练任务的表单内容待实现。</div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">取消</Button></DialogClose>
            <Button onClick={() => { console.log("New task created"); setIsNewTaskModalOpen(false); }}>创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainingPage;