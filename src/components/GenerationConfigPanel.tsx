import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RotateCcw, Save, GitBranch, FileUp, FolderInput, Database, Edit3 } from 'lucide-react';

interface ModelOption {
  value: string;
  label: string;
}

const GenerationConfigPanel = () => {
  const [genSeedDataSourceType, setGenSeedDataSourceType] = useState("default_upstream");
  const [genCustomSeedDataPath, setGenCustomSeedDataPath] = useState("");
  const [genStrategy, setGenStrategy] = useState("reasoning_distillation");
  const [genCount, setGenCount] = useState(100);
  const [batchSize, setBatchSize] = useState(10);
  const [topicDescription, setTopicDescription] = useState("");
  const [apiProvider, setApiProvider] = useState("openai");
  const [selectedModel, setSelectedModel] = useState("");
  const [availableModels, setAvailableModels] = useState<ModelOption[]>([]);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [genOutputLocationType, setGenOutputLocationType] = useState("default_location");
  const [genCustomOutputPath, setGenCustomOutputPath] = useState("./output/generated_data");
  const [genOutputFormat, setGenOutputFormat] = useState("jsonl");

  useEffect(() => {
    const fetchModels = async (provider: string) => {
      console.log(`Fetching models for provider: ${provider}`);
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      let models: ModelOption[] = [];
      if (provider === "openai") models = [{ value: "gpt-4", label: "GPT-4" }, { value: "gpt-4-turbo", label: "GPT-4 Turbo" }, { value: "gpt-3.5-turbo", label: "GPT-3.5-Turbo" }];
      else if (provider === "anthropic") models = [{ value: "claude-3-opus", label: "Claude 3 Opus" }, { value: "claude-3-sonnet", label: "Claude 3 Sonnet" }, { value: "claude-2.1", label: "Claude 2.1" }];
      else if (provider === "deepseek") models = [{ value: "deepseek-coder", label: "DeepSeek Coder" }, { value: "deepseek-llm", label: "DeepSeek LLM" }];
      else if (provider === "local") models = [{ value: "local-model-1", label: "本地模型 1" }];
      setAvailableModels(models);
      if (models.length > 0) setSelectedModel(models[0].value);
      else setSelectedModel("");
    };
    if (apiProvider) fetchModels(apiProvider);
  }, [apiProvider]);

  const formSectionClass = "mb-8"; // Increased from mb-6 for more spacing
  const formSectionTitleClass = "text-md font-bold text-text-primary-html mb-3"; // Changed font-semibold to font-bold
  const formGroupClass = "mb-3"; // Reduced from mb-4
  const formLabelClass = "block mb-1 text-sm font-medium text-text-primary-html"; // Reduced from mb-1.5
  const formControlSmClass = "w-full px-3 py-1.5 rounded-md border-gray-300 bg-white text-sm text-text-primary-html placeholder:text-text-light-html focus:border-primary-dark focus:ring-1 focus:ring-primary-dark/50";
  const formHelperTextClass = "text-xs text-gray-500 mt-0.5";


  const handleSave = () => console.log("Save Generation Config", { /* ... existing save data ... */ });
  const handleReset = () => { /* ... existing reset logic ... */ };

  const renderSeedDataSourceInput = () => {
    if (genStrategy === "reasoning_distillation" || genStrategy === "seed_expansion") {
      if (genSeedDataSourceType === "custom_seed") {
        return (
          <div className={`${formGroupClass} mt-2.5`}> {/* Adjusted mt */}
            <Label htmlFor="gen-custom-seed-path" className={formLabelClass}>自定义种子数据 (路径或内容)</Label>
            <div className="flex items-center">
              <Input type="text" id="gen-custom-seed-path" value={genCustomSeedDataPath} onChange={(e) => setGenCustomSeedDataPath(e.target.value)} placeholder="输入种子文件路径或直接粘贴种子内容" className={formControlSmClass}/>
              <Button variant="outline" size="icon" className="ml-2 h-8 w-8" title="上传文件"><FileUp size={16} /></Button>
            </div>
            <p className={formHelperTextClass}>例如: /path/to/seeds.jsonl 或直接粘贴JSON内容。</p>
          </div>
        );
      }
    }
    return null;
  };
  
  const renderTopicInput = () => {
    if (genStrategy === "topic_guided") {
         return (
            <div className={formGroupClass}>
                <Label htmlFor="topic-description" className={formLabelClass}>主题描述</Label>
                <Textarea id="topic-description" value={topicDescription} onChange={(e) => setTopicDescription(e.target.value)} placeholder="详细描述您希望生成内容的主题、领域、风格等..." className={`${formControlSmClass} min-h-[80px]`} /> {/* Reduced min-h */}
            </div>
        );
    }
    return null;
  }

  return (
    <div className="bg-white p-0 rounded-xl shadow-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center"> {/* Reduced py */}
        <h3 className="text-lg font-semibold text-text-primary-html flex items-center"> {/* Reduced text-xl to text-lg */}
          <GitBranch size={20} className="mr-2.5 text-primary-dark" />数据生成配置 {/* Reduced size and mr */}
        </h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="text-xs px-3 py-1.5 h-auto hover:bg-primary-dark/10 hover:text-primary-dark focus-visible:ring-primary-dark/50" onClick={handleReset}><RotateCcw size={14} className="mr-1.5" />恢复默认</Button>
          <Button size="sm" className="text-xs px-3 py-1.5 h-auto bg-gradient-to-r from-primary-dark to-primary-light hover:opacity-90 hover:brightness-105 transition-all" onClick={handleSave}><Save size={14} className="mr-1.5" />保存配置</Button>
        </div>
      </div>

      <div className="p-5 space-y-6"> {/* Reduced p-6 to p-5, space-y-8 to space-y-6 */}
        {(genStrategy === "reasoning_distillation" || genStrategy === "seed_expansion") && (
          <div className={`${formSectionClass} bg-slate-50 p-4 rounded-lg`}>
            <h4 className={formSectionTitleClass}>数据来源 (种子数据)</h4>
            <RadioGroup value={genSeedDataSourceType} onValueChange={setGenSeedDataSourceType} className="space-y-1.5"> {/* Reduced space-y */}
              <div className="flex items-center space-x-2"><RadioGroupItem value="default_upstream" id="gen-seed-default" /><Label htmlFor="gen-seed-default" className="text-sm font-normal flex items-center"><Database size={16} className="mr-2 text-gray-600" /> 使用上游种子数据/默认库</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="custom_seed" id="gen-seed-custom" /><Label htmlFor="gen-seed-custom" className="text-sm font-normal flex items-center"><Edit3 size={16} className="mr-2 text-gray-600" /> 自定义种子数据来源</Label></div>
            </RadioGroup>
            {renderSeedDataSourceInput()}
          </div>
        )}

        {/* Separator after Seed Data Source if it was rendered */}
        {(genStrategy === "reasoning_distillation" || genStrategy === "seed_expansion") && <div className="h-px bg-gray-200 my-6"></div>}

        <div className={`${formSectionClass} bg-slate-50 p-4 rounded-lg`}>
          <h4 className={formSectionTitleClass}>基础配置</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3"> {/* Adjusted gap and cols */}
            <div className={formGroupClass}><Label htmlFor="gen-strategy" className={formLabelClass}>生成策略</Label><Select value={genStrategy} onValueChange={setGenStrategy}><SelectTrigger id="gen-strategy" className={formControlSmClass}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="reasoning_distillation">推理链蒸馏 (qa → qra)</SelectItem><SelectItem value="seed_expansion">基于种子扩展 (qra → qra)</SelectItem><SelectItem value="topic_guided">基于主题引导 (0 → qra)</SelectItem></SelectContent></Select></div>
            <div className={formGroupClass}><Label htmlFor="gen-count" className={formLabelClass}>生成数量</Label><Input type="number" id="gen-count" value={genCount} onChange={(e) => setGenCount(Math.max(1, parseInt(e.target.value, 10) || 1))} className={formControlSmClass} /></div>
            <div className={formGroupClass}><Label htmlFor="batch-size" className={formLabelClass}>批次大小</Label><Input type="number" id="batch-size" value={batchSize} min="1" max="100" onChange={(e) => setBatchSize(Math.min(100, Math.max(1, parseInt(e.target.value, 10) || 1)))} className={formControlSmClass} /></div>
          </div>
        </div>

        <div className="h-px bg-gray-200 my-6"></div>

        {genStrategy === "topic_guided" && (
             <div className={`${formSectionClass} bg-slate-50 p-4 rounded-lg`}>
                <h4 className={formSectionTitleClass}>主题引导配置</h4>
                {renderTopicInput()}
            </div>
        )}
        
        {genStrategy === "topic_guided" && <div className="h-px bg-gray-200 my-6"></div>}

        <div className={`${formSectionClass} bg-slate-50 p-4 rounded-lg`}>
          <h4 className={formSectionTitleClass}>模型配置</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3"> {/* Adjusted gap */}
            <div className={formGroupClass}><Label htmlFor="api-provider" className={formLabelClass}>服务商</Label><Select value={apiProvider} onValueChange={setApiProvider}><SelectTrigger id="api-provider" className={formControlSmClass}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="openai">OpenAI</SelectItem><SelectItem value="anthropic">Anthropic</SelectItem><SelectItem value="deepseek">DeepSeek</SelectItem><SelectItem value="local">本地模型</SelectItem></SelectContent></Select></div>
            <div className={formGroupClass}><Label htmlFor="selected-model" className={formLabelClass}>模型</Label><Select value={selectedModel} onValueChange={setSelectedModel} disabled={availableModels.length === 0}><SelectTrigger id="selected-model" className={formControlSmClass}><SelectValue placeholder={availableModels.length === 0 && apiProvider ? "加载中..." : (availableModels.length === 0 ? "请先选择服务商" : "选择模型")} /></SelectTrigger><SelectContent>{availableModels.map((model) => (<SelectItem key={model.value} value={model.value}>{model.label}</SelectItem>))}</SelectContent></Select></div>
          </div>
        </div>

        <div className="h-px bg-gray-200 my-6"></div>

        <Accordion type="single" collapsible defaultValue="advanced-settings-item" className="w-full">
          <AccordionItem value="advanced-settings-item" className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <AccordionTrigger className="flex items-center justify-between w-full px-5 py-3 text-md font-semibold text-text-primary-html bg-gray-50 hover:bg-gray-100 data-[state=open]:border-b border-gray-200 rounded-t-lg"> {/* Reduced padding and text size */}
                高级配置
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-white"> {/* Reduced padding */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-4"> {/* Adjusted gap */}
                <div><Label htmlFor="gen-temp" className={`${formLabelClass} text-xs`}>温度 (当前: {temperature.toFixed(1)})</Label><Input type="range" id="gen-temp" min="0" max="1" step="0.1" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-dark mt-1" /></div>
                <div><Label htmlFor="gen-topp" className={`${formLabelClass} text-xs`}>Top P (当前: {topP.toFixed(1)})</Label><Input type="range" id="gen-topp" min="0" max="1" step="0.1" value={topP} onChange={(e) => setTopP(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-dark mt-1" /></div>
                <div><Label htmlFor="gen-freq-penalty" className={`${formLabelClass} text-xs`}>频率惩罚 (当前: {frequencyPenalty.toFixed(1)})</Label><Input type="range" id="gen-freq-penalty" min="-2" max="2" step="0.1" value={frequencyPenalty} onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-dark mt-1" /></div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="h-px bg-gray-200 my-6"></div>
        
        <div className={`${formSectionClass} bg-slate-50 p-4 rounded-lg`}>
            <h4 className={formSectionTitleClass}>输出设置</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3"> {/* Adjusted gap */}
                <div className={formGroupClass}>
                    <Label className={formLabelClass}>输出位置</Label>
                    <RadioGroup value={genOutputLocationType} onValueChange={setGenOutputLocationType} className="space-y-1.5">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="default_location" id="gen-out-default" /><Label htmlFor="gen-out-default" className="text-sm font-normal">使用默认输出路径</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="custom_location" id="gen-out-custom" /><Label htmlFor="gen-out-custom" className="text-sm font-normal">自定义输出路径</Label></div>
                    </RadioGroup>
                    {genOutputLocationType === "custom_location" && (
                        <div className="mt-2.5 flex items-center"> {/* Adjusted mt */}
                            <Input type="text" id="gen-custom-outputdir" value={genCustomOutputPath} onChange={(e) => setGenCustomOutputPath(e.target.value)} className={formControlSmClass} placeholder="./output/my_generated_data"/>
                            <Button variant="outline" size="icon" className="ml-2 h-8 w-8" title="选择文件夹"><FolderInput size={16} /></Button>
                        </div>
                    )}
                </div>
                <div className={formGroupClass}>
                    <Label htmlFor="gen-outputformat" className={formLabelClass}>输出格式</Label>
                    <Select value={genOutputFormat} onValueChange={setGenOutputFormat}>
                        <SelectTrigger id="gen-outputformat" className={formControlSmClass}><SelectValue /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="jsonl">JSONL</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GenerationConfigPanel;