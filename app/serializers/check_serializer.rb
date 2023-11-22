class CheckSerializer < ActiveModel::Serializer
  attributes :id, :title, :status, :done
  has_one :job
end
