import styled from "styled-components";

const ImagesUploaderWrapper = styled.div`
  /* Luxury car theme for image uploader */
  width: 100%;
  margin-bottom: 16px;

  .upload-area {
    border: 2px dashed rgba(212, 175, 55, 0.4);
    border-radius: 16px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(8px);
    position: relative;
  }

  .upload-area:hover {
    border-color: #d4af37;
    background: rgba(212, 175, 55, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(212, 175, 55, 0.2);
  }

  .upload-area:active {
    transform: translateY(0);
  }

  .upload-icon {
    font-size: 48px;
    color: #d4af37;
    margin-bottom: 16px;
    opacity: 0.9;
  }

  .upload-text {
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 8px;
  }

  .upload-subtext {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 400;
  }

  /* Upload card for showing uploaded image */
  .upload-card {
    border: 1px solid rgba(212, 175, 55, 0.3);
    border-radius: 16px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(8px);
    transition: all 0.3s ease;
  }

  .upload-card:hover {
    border-color: #d4af37;
    box-shadow: 0 8px 20px rgba(212, 175, 55, 0.2);
  }

  .uploaded-box {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
  }

  .uploaded-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
  }

  /* Image buttons */
  .img-buttons {
    position: absolute;
    bottom: 12px;
    right: 12px;
    display: flex;
    gap: 8px;
    background: rgba(10, 10, 10, 0.8);
    backdrop-filter: blur(4px);
    padding: 6px 10px;
    border-radius: 30px;
    border: 1px solid rgba(212, 175, 55, 0.3);
  }

  .img-buttons button {
    background: none;
    border: none;
    color: #d4af37;
    font-size: 14px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 50%;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
  }

  .img-buttons button:hover {
    background: rgba(212, 175, 55, 0.2);
    color: #e0b84d;
    transform: scale(1.1);
  }

  .img-buttons button:active {
    transform: scale(0.95);
  }

  /* Loading state */
  .upload-area.loading {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .upload-area.loading .upload-icon {
    animation: spin 1s linear infinite;
  }

  /* Responsive adjustments */
  @media (max-width: 380px) {
    .upload-area {
      padding: 30px 16px;
    }
    
    .upload-icon {
      font-size: 36px;
      margin-bottom: 12px;
    }
    
    .upload-text {
      font-size: 14px;
    }
    
    .upload-subtext {
      font-size: 11px;
    }
    
    .uploaded-box {
      height: 160px;
    }
    
    .upload-card {
      padding: 12px;
    }
  }

  /* Animations */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Progress indicator for upload */
  .upload-progress {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    overflow: hidden;
    border-radius: 16px 16px 0 0;
  }

  .upload-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #d4af37 0%, #f5d742 100%);
    transition: width 0.3s ease;
  }

  /* Error state */
  .upload-area.error {
    border-color: #ef5350;
    background: rgba(239, 83, 80, 0.1);
  }

  .upload-area.error .upload-icon {
    color: #ef5350;
  }

  .upload-area.error .upload-text {
    color: #ef5350;
  }

  /* Success state */
  .upload-area.success {
    border-color: #81c784;
    background: rgba(129, 199, 132, 0.1);
  }

  .upload-area.success .upload-icon {
    color: #81c784;
  }

  .upload-area.success .upload-text {
    color: #81c784;
  }
`;

export default ImagesUploaderWrapper;