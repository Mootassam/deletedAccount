import styled from "styled-components";

const ImagesUploaderWrapper = styled.div`
  width: 100%;
  margin-bottom: 16px;

  .upload-area {
    border: 2px dashed rgba(212, 175, 55, 0.4);
    border-radius: 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(15, 15, 15, 0.7);
    backdrop-filter: blur(12px);
    position: relative;
    overflow: hidden;
  }

  .upload-area:hover {
    border-color: #d4af37;
    background: rgba(212, 175, 55, 0.08);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(212, 175, 55, 0.2);
  }

  .upload-area:active {
    transform: translateY(0);
  }

  .upload-icon {
    font-size: 52px;
    color: #d4af37;
    margin-bottom: 16px;
    transition: all 0.3s;
  }

  .upload-area:hover .upload-icon {
    transform: scale(1.05);
    filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.5));
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

  /* Loading state */
  .upload-area.loading {
    opacity: 0.8;
    cursor: not-allowed;
    border-color: #d4af37;
  }

  .upload-area.loading .upload-icon {
    animation: spin 1s linear infinite;
  }

  /* Progress bar */
  .upload-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }

  .upload-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #d4af37 0%, #f5d742 100%);
    transition: width 0.3s ease;
  }

  /* Upload card for showing uploaded image */
  .upload-card {
    border: 1px solid rgba(212, 175, 55, 0.3);
    border-radius: 16px;
    padding: 16px;
    background: rgba(15, 15, 15, 0.6);
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
    background: rgba(0, 0, 0, 0.4);
  }

  .uploaded-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
  }

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

  /* Responsive adjustments */
  @media (max-width: 380px) {
    .upload-area {
      padding: 30px 16px;
    }
    .upload-icon {
      font-size: 44px;
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
`;

export default ImagesUploaderWrapper;