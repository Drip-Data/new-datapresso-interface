import React from 'react';
import { Search, HelpCircle, UserCircle } from 'lucide-react'; // Assuming UserCircle for avatar placeholder

interface WorkflowTopbarProps {
  pageTitle: string;
}

const WorkflowTopbar: React.FC<WorkflowTopbarProps> = ({ pageTitle }) => {
  // Placeholder for user data
  const user = {
    name: "张数据",
    role: "数据科学家",
    avatarUrl: undefined as string | undefined
  };

  // Original page title gradient: background: var(--gradient-primary);
  // --gradient-primary: linear-gradient(to right, #6941FF, #89FFE6);
  // These are primary-dark and primary-light in tailwind.config.ts
  const pageTitleStyle = "text-[1.75rem] font-semibold bg-gradient-to-r from-primary-dark to-primary-light text-transparent bg-clip-text tracking-[-0.5px]"; // text-3xl is 2.25rem, 1.75rem is closer to original

  return (
    // Original: background-color: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); padding: 1.25rem 2rem; box-shadow: var(--shadow-sm);
    // shadow-sm-html is defined in tailwind.config.ts
    <div className="sticky top-0 z-[9] bg-white/80 backdrop-blur-lg shadow-sm-html rounded-2xl">
      {/* Original: padding: 1.25rem 2rem; -> py-5 px-8 */}
      <div className="container mx-auto flex items-center justify-between py-5 px-8">
        {/* Page Title */}
        <h1 className={pageTitleStyle}>
          {pageTitle}
        </h1>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          {/* Original button was .btn .btn-secondary .btn-icon. Here using simple styling. */}
          <button
            title="帮助"
            className="p-2 rounded-lg hover:bg-gray-200 text-text-secondary-html hover:text-text-primary-html transition-colors" // Adjusted padding and icon size
            onClick={() => console.log('Show help')}
          >
            <HelpCircle className="h-5 w-5" />
          </button>
          
          {/* User Profile */}
          {/* Original: margin-left: 1.5rem; */}
          <div className="flex items-center space-x-3 ml-3 cursor-pointer group"> {/* ml-3 is approx 0.75rem, original was 1.5rem. Use ml-6 for 1.5rem */}
            {/* Original img: width: 38px; height: 38px; border: 2px solid var(--primary-light); */}
            {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="User Avatar" className="h-[38px] w-[38px] rounded-full border-2 border-primary-light object-cover" />
            ) : (
                <div className="h-[38px] w-[38px] rounded-full bg-gradient-to-br from-primary-dark to-primary-light flex items-center justify-center text-white font-semibold border-2 border-primary-light">
                    {user.name.substring(0,1)}
                </div>
            )}
            {/* Original user-info: margin-left: 0.75rem; line-height: 1.2; */}
            <div className="text-sm leading-tight ml-3"> {/* Added ml-3 for spacing */}
              {/* Original user-name: font-weight: 600; font-size: 0.9375rem; */}
              <div className="font-semibold text-text-primary-html group-hover:text-primary-dark transition-colors">{user.name}</div>
              {/* Original user-role: font-size: 0.8125rem; color: var(--text-secondary); */}
              <div className="text-xs text-text-secondary-html group-hover:text-primary-html transition-colors">{user.role}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowTopbar;