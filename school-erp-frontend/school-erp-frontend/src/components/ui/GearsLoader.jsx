import React from 'react';

export const GearsLoader = ({ className = "w-24 h-24" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 150 150" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Mask for large gear cutouts (inner hole) */}
          <mask id="large-gear-mask">
            <rect x="-50" y="-50" width="100" height="100" fill="white" />
            <circle cx="0" cy="0" r="11" fill="black" />
          </mask>
          {/* Mask for small gear cutouts */}
          <mask id="small-gear-mask">
            <rect x="-30" y="-30" width="60" height="60" fill="white" />
            <circle cx="0" cy="0" r="7" fill="black" />
          </mask>
          
          {/* Large gear geometry: teeth + outer circle body */}
          <g id="gear-large-body">
            <rect x="-5.5" y="-33" width="11" height="66" rx="2" />
            <rect x="-5.5" y="-33" width="11" height="66" rx="2" transform="rotate(30)" />
            <rect x="-5.5" y="-33" width="11" height="66" rx="2" transform="rotate(60)" />
            <rect x="-5.5" y="-33" width="11" height="66" rx="2" transform="rotate(90)" />
            <rect x="-5.5" y="-33" width="11" height="66" rx="2" transform="rotate(120)" />
            <rect x="-5.5" y="-33" width="11" height="66" rx="2" transform="rotate(150)" />
            <circle cx="0" cy="0" r="26" />
          </g>

          {/* Small gear geometry */}
          <g id="gear-small-body">
            <rect x="-3.5" y="-21" width="7" height="42" rx="1.5" />
            <rect x="-3.5" y="-21" width="7" height="42" rx="1.5" transform="rotate(30)" />
            <rect x="-3.5" y="-21" width="7" height="42" rx="1.5" transform="rotate(60)" />
            <rect x="-3.5" y="-21" width="7" height="42" rx="1.5" transform="rotate(90)" />
            <rect x="-3.5" y="-21" width="7" height="42" rx="1.5" transform="rotate(120)" />
            <rect x="-3.5" y="-21" width="7" height="42" rx="1.5" transform="rotate(150)" />
            <circle cx="0" cy="0" r="16" />
          </g>
        </defs>

        {/* 1. Large Blue Gear (Top-Right) */}
        <g transform="translate(96, 48)">
          <g>
            <use href="#gear-large-body" fill="#3B82F6" mask="url(#large-gear-mask)" />
            {/* Concentric Grey Ring */}
            <circle cx="0" cy="0" r="16.5" stroke="#4B5563" strokeWidth="4.5" fill="none" />
            
            {/* Clockwise Rotation */}
            <animateTransform 
              attributeName="transform" 
              type="rotate" 
              from="0" 
              to="360" 
              dur="8s" 
              repeatCount="indefinite" 
            />
          </g>
        </g>

        {/* 2. Large Grey Gear (Bottom-Left) */}
        <g transform="translate(52, 92)">
          <g>
            <use href="#gear-large-body" fill="#4B5563" mask="url(#large-gear-mask)" />
            {/* Concentric Blue Ring */}
            <circle cx="0" cy="0" r="16.5" stroke="#3B82F6" strokeWidth="4.5" fill="none" />
            
            {/* Counter-Clockwise Rotation */}
            <animateTransform 
              attributeName="transform" 
              type="rotate" 
              from="0" 
              to="-360" 
              dur="8s" 
              repeatCount="indefinite" 
            />
          </g>
        </g>

        {/* 3. Small Grey Gear (Bottom-Right) */}
        <g transform="translate(98, 110)">
          <g>
            <use href="#gear-small-body" fill="#4B5563" mask="url(#small-gear-mask)" />
            {/* Concentric Blue Ring */}
            <circle cx="0" cy="0" r="10.5" stroke="#3B82F6" strokeWidth="3" fill="none" />
            
            {/* Clockwise Rotation (faster speed ratio) */}
            <animateTransform 
              attributeName="transform" 
              type="rotate" 
              from="0" 
              to="360" 
              dur="5s" 
              repeatCount="indefinite" 
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
