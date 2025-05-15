import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, CheckSquare, PlayCircle } from 'lucide-react';

interface WorkflowActionsCardProps {
  onSwitchToExecuteTab: () => void;
}

const WorkflowActionsCard: React.FC<WorkflowActionsCardProps> = ({ onSwitchToExecuteTab }) => {
  const [workflowName, setWorkflowName] = useState("我的LIMO流程");
  const [workflowDescription, setWorkflowDescription] = useState("");

  const handleCheckConfig = () => {
    console.log("Checking config for workflow:", workflowName, workflowDescription);
    alert("流程配置检查中... (详情见控制台)");
  };

  const handleSaveConfig = () => {
    console.log("Saving config for workflow:", workflowName, workflowDescription);
    alert(`流程 "${workflowName}" 配置已保存! (详情见控制台)`);
  };

  // Removed original navigateToExecution, will call onSwitchToExecuteTab directly
  
  const formGroupClass = "mb-4"; // Slightly less margin than config panels
  const formLabelClass = "block mb-1.5 text-sm font-medium text-text-primary-html";
  const formControlBaseClass = "w-full px-4 py-2.5 rounded-xl border-gray-300 bg-white text-[0.9375rem] text-text-primary-html placeholder:text-text-light-html focus:border-primary-dark focus:ring-2 focus:ring-primary-dark/30";


  return (
    // Original card: bg-white, rounded-xl, shadow-md (shadow-md-html from config)
    <div className="bg-bg-card-html rounded-xl shadow-md-html mt-6"> {/* Added mt-6 for spacing from card above */}
      {/* Card Header */}
      <div className="px-6 py-5 border-b border-black/5">
        <h2 className="text-xl font-semibold text-text-primary-html flex items-center">
          <Save size={22} className="mr-3 text-primary-dark" /> {/* Using Save icon */}
          保存与应用
        </h2>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6"> {/* Using grid for form-row behavior */}
          <div className={formGroupClass}>
            <Label htmlFor="workflow-name" className={formLabelClass}>流程名称</Label>
            <Input 
              type="text" 
              id="workflow-name" 
              value={workflowName} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWorkflowName(e.target.value)} 
              className={formControlBaseClass}
            />
          </div>
          <div className={formGroupClass}>
            <Label htmlFor="workflow-description" className={formLabelClass}>描述</Label>
            <Input 
              type="text" 
              id="workflow-description" 
              value={workflowDescription} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWorkflowDescription(e.target.value)} 
              placeholder="可选描述..."
              className={formControlBaseClass}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-4"> {/* Original: .btn-group, justify-content: flex-end; margin-top: 1rem; */}
          <Button variant="outline" onClick={handleCheckConfig}>
            <CheckSquare size={16} className="mr-2" /> 检查配置
          </Button>
          <Button variant="default" className="bg-gradient-to-r from-primary-dark to-primary-light hover:opacity-90" onClick={handleSaveConfig}>
            <Save size={16} className="mr-2" /> 保存配置
          </Button>
          <Button className="bg-success-html hover:bg-success-html/90 text-white" onClick={onSwitchToExecuteTab}> {/* Using success color and new handler */}
            <PlayCircle size={16} className="mr-2" /> 进入执行控制
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowActionsCard;