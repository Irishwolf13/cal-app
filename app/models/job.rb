class Job < ApplicationRecord
  has_many :events, dependent: :destroy
  has_many :memo_boxes, dependent: :destroy
  has_many :check_boxes, dependent: :destroy
  has_many :powder_colors, dependent: :destroy
end